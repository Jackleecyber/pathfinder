import { chromium, Browser, Page } from 'playwright';
import * as cheerio from 'cheerio';
import { config } from '../config';
import { logger } from '../utils/logger';
import { WebScrapeRequest, WebScrapeResult, FinancialData, Provenance } from '@shared/types';

export interface ScrapedTable {
  headers: string[];
  rows: any[][];
  metadata: {
    caption?: string;
    className?: string;
    position: { x: number; y: number };
  };
}

export class WebScrapingService {
  private browser: Browser | null = null;

  async initialize(): Promise<void> {
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      logger.info('Web scraping service initialized');
    } catch (error) {
      logger.error('Failed to initialize web scraping service:', error);
      throw error;
    }
  }

  async scrapeUrl(request: WebScrapeRequest): Promise<WebScrapeResult> {
    if (!this.browser) {
      await this.initialize();
    }

    const startTime = Date.now();
    logger.info(`Starting web scrape: ${request.url}`);

    try {
      const page = await this.browser!.newPage();
      
      // Set user agent and viewport
      await page.setUserAgent(config.webScraping.playwright.userAgent);
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Navigate to the URL
      await page.goto(request.url, { 
        waitUntil: 'networkidle',
        timeout: config.webScraping.playwright.timeout 
      });

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Get page content
      const content = await page.content();
      const title = await page.title();

      // Extract data based on request parameters
      const extractedData = await this.extractDataFromPage(content, request);

      await page.close();

      const processingTime = Date.now() - startTime;

      const result: WebScrapeResult = {
        id: this.generateScrapeId(),
        url: request.url,
        title,
        extractedData: {
          tables: extractedData.tables,
          text: extractedData.text,
          metadata: {
            processingTime,
            tablesFound: extractedData.tables.length,
            textLength: extractedData.text.length,
          },
        },
        status: 'success',
        scrapedAt: new Date().toISOString(),
      };

      logger.info(`Web scrape completed: ${request.url}`, {
        processingTime,
        tablesFound: extractedData.tables.length,
      });

      return result;
    } catch (error) {
      logger.error(`Web scrape failed: ${request.url}`, error);
      
      return {
        id: this.generateScrapeId(),
        url: request.url,
        title: 'Error',
        extractedData: {
          tables: [],
          text: '',
          metadata: {},
        },
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        scrapedAt: new Date().toISOString(),
      };
    }
  }

  private async extractDataFromPage(content: string, request: WebScrapeRequest): Promise<{
    tables: ScrapedTable[];
    text: string;
  }> {
    const $ = cheerio.load(content);
    
    let tables: ScrapedTable[] = [];
    let text = '';

    // Extract text if requested
    if (request.extractText !== false) {
      text = this.extractText($);
    }

    // Extract tables if requested
    if (request.extractTables !== false) {
      tables = await this.extractTables($, request);
    }

    return { tables, text };
  }

  private extractText($: cheerio.CheerioAPI): string {
    // Remove script and style elements
    $('script, style, nav, header, footer').remove();
    
    // Extract text from main content areas
    const contentSelectors = [
      'main',
      'article',
      '.content',
      '.main-content',
      '#content',
      '.financial-data',
      '.earnings',
      '.results',
    ];

    let text = '';
    
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        text += element.text() + '\n';
      }
    }

    // If no specific content found, get all text
    if (!text.trim()) {
      text = $('body').text();
    }

    return this.cleanText(text);
  }

  private async extractTables($: cheerio.CheerioAPI, request: WebScrapingRequest): Promise<ScrapedTable[]> {
    const tables: ScrapedTable[] = [];

    // Find all table elements
    $('table').each((index, table) => {
      try {
        const scrapedTable = this.parseTable($, $(table), index);
        if (scrapedTable && this.isFinancialTable(scrapedTable)) {
          tables.push(scrapedTable);
        }
      } catch (error) {
        logger.warn(`Error parsing table ${index}:`, error);
      }
    });

    // Also look for div-based tables (common in financial sites)
    $('.table, .data-table, .financial-table').each((index, element) => {
      try {
        const scrapedTable = this.parseDivTable($, $(element), index);
        if (scrapedTable && this.isFinancialTable(scrapedTable)) {
          tables.push(scrapedTable);
        }
      } catch (error) {
        logger.warn(`Error parsing div table ${index}:`, error);
      }
    });

    return tables;
  }

  private parseTable($: cheerio.CheerioAPI, $table: cheerio.Cheerio<cheerio.Element>, index: number): ScrapedTable | null {
    const headers: string[] = [];
    const rows: any[][] = [];

    // Extract headers
    $table.find('thead th, tr:first-child th, tr:first-child td').each((_, th) => {
      const headerText = $(th).text().trim();
      if (headerText) {
        headers.push(headerText);
      }
    });

    // If no headers in thead, try first row
    if (headers.length === 0) {
      $table.find('tr:first-child td').each((_, td) => {
        const headerText = $(td).text().trim();
        if (headerText) {
          headers.push(headerText);
        }
      });
    }

    // Extract rows
    $table.find('tbody tr, tr:not(:first-child)').each((_, tr) => {
      const row: any[] = [];
      $(tr).find('td, th').each((_, cell) => {
        const cellText = $(cell).text().trim();
        row.push(this.parseCellValue(cellText));
      });
      
      if (row.length > 0 && row.some(cell => cell !== '')) {
        rows.push(row);
      }
    });

    if (headers.length === 0 && rows.length === 0) {
      return null;
    }

    return {
      headers: headers.length > 0 ? headers : Array(rows[0]?.length || 0).fill(''),
      rows,
      metadata: {
        caption: $table.find('caption').text().trim() || undefined,
        className: $table.attr('class') || undefined,
        position: { x: 0, y: index },
      },
    };
  }

  private parseDivTable($: cheerio.CheerioAPI, $container: cheerio.Cheerio<cheerio.Element>, index: number): ScrapedTable | null {
    const headers: string[] = [];
    const rows: any[][] = [];

    // Look for header row
    $container.find('.header, .row-header, .th').each((_, header) => {
      const headerText = $(header).text().trim();
      if (headerText) {
        headers.push(headerText);
      }
    });

    // Look for data rows
    $container.find('.row, .data-row, .tr').each((_, row) => {
      const rowData: any[] = [];
      $(row).find('.cell, .td, .data').each((_, cell) => {
        const cellText = $(cell).text().trim();
        rowData.push(this.parseCellValue(cellText));
      });
      
      if (rowData.length > 0) {
        rows.push(rowData);
      }
    });

    if (headers.length === 0 && rows.length === 0) {
      return null;
    }

    return {
      headers: headers.length > 0 ? headers : Array(rows[0]?.length || 0).fill(''),
      rows,
      metadata: {
        className: $container.attr('class') || undefined,
        position: { x: 0, y: index },
      },
    };
  }

  private parseCellValue(text: string): any {
    // Try to parse as number
    const numericValue = this.parseNumericValue(text);
    if (!isNaN(numericValue)) {
      return numericValue;
    }

    // Return as string
    return text;
  }

  private parseNumericValue(text: string): number {
    if (!text) return NaN;
    
    // Remove currency symbols, commas, and parentheses
    const cleaned = text.replace(/[$,\s()]/g, '');
    
    // Handle negative numbers in parentheses
    if (text.includes('(') && text.includes(')')) {
      return -parseFloat(cleaned);
    }
    
    return parseFloat(cleaned);
  }

  private isFinancialTable(table: ScrapedTable): boolean {
    const financialKeywords = [
      'revenue', 'income', 'profit', 'loss', 'assets', 'liabilities',
      'equity', 'cash', 'debt', 'sales', 'expenses', 'costs',
      'earnings', 'ebitda', 'margin', 'ratio', 'growth', 'return',
      'quarter', 'year', 'period', 'million', 'billion', 'thousand'
    ];

    // Check headers
    const headerText = table.headers.join(' ').toLowerCase();
    const hasFinancialHeaders = financialKeywords.some(keyword => 
      headerText.includes(keyword)
    );

    // Check if table has numeric data
    const hasNumericData = table.rows.some(row => 
      row.some(cell => typeof cell === 'number' && !isNaN(cell))
    );

    // Check table size (financial tables are usually substantial)
    const isSubstantial = table.rows.length >= 3 && table.headers.length >= 2;

    return hasFinancialHeaders && hasNumericData && isSubstantial;
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  async scrapeFinancialStatements(url: string): Promise<FinancialData[]> {
    const request: WebScrapingRequest = {
      url,
      extractTables: true,
      extractText: true,
    };

    const result = await this.scrapeUrl(request);
    
    if (result.status === 'error') {
      throw new Error(result.error || 'Scraping failed');
    }

    // Convert scraped tables to financial data
    const financialData: FinancialData[] = [];
    
    result.extractedData.tables.forEach((table, index) => {
      const data = this.convertTableToFinancialData(table, url, index);
      if (data) {
        financialData.push(data);
      }
    });

    return financialData;
  }

  private convertTableToFinancialData(table: ScrapedTable, url: string, index: number): FinancialData | null {
    try {
      if (table.rows.length < 2) return null;

      const values: any = {};
      
      // Convert table rows to key-value pairs
      table.rows.forEach(row => {
        if (row.length >= 2 && row[0] && row[1]) {
          const key = String(row[0]).trim();
          const value = typeof row[1] === 'number' ? row[1] : this.parseNumericValue(String(row[1]));
          if (!isNaN(value)) {
            values[key] = value;
          }
        }
      });

      if (Object.keys(values).length === 0) return null;

      return {
        id: this.generateDataId(),
        type: this.determineFinancialType(table.headers),
        period: this.extractPeriod(table.headers.join(' ')),
        values,
        metadata: {
          currency: 'USD',
          units: 'millions',
          source: {
            source: 'web',
            url,
            pageNumber: index + 1,
            tableIndex: index,
            extractionMethod: 'web_scraping',
            timestamp: new Date().toISOString(),
          },
        },
      };
    } catch (error) {
      logger.error('Error converting table to financial data:', error);
      return null;
    }
  }

  private determineFinancialType(headers: string[]): 'income_statement' | 'balance_sheet' | 'cash_flow' | 'transaction_data' | 'market_data' {
    const headerText = headers.join(' ').toLowerCase();
    
    if (headerText.includes('revenue') || headerText.includes('income') || headerText.includes('profit')) {
      return 'income_statement';
    }
    if (headerText.includes('assets') || headerText.includes('liabilities') || headerText.includes('equity')) {
      return 'balance_sheet';
    }
    if (headerText.includes('cash') || headerText.includes('flow')) {
      return 'cash_flow';
    }
    
    return 'transaction_data';
  }

  private extractPeriod(text: string): string {
    // Look for year patterns
    const yearMatch = text.match(/(\d{4})/);
    if (yearMatch) {
      return yearMatch[1];
    }
    
    // Look for quarter patterns
    const quarterMatch = text.match(/(Q[1-4]|quarter\s+[1-4])/i);
    if (quarterMatch) {
      return quarterMatch[0];
    }
    
    return new Date().getFullYear().toString();
  }

  private generateScrapeId(): string {
    return `scrape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDataId(): string {
    return `data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

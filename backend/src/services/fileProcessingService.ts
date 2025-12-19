import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import csvParser from 'csv-parser';
import sharp from 'sharp';
import { TesseractWorker } from 'tesseract.js';
import { config } from '../config';
import { logger } from '../utils/logger';
import { FinancialData, Provenance } from '@shared/types';

export interface ProcessedFile {
  id: string;
  name: string;
  type: string;
  extractedData: FinancialData[];
  metadata: {
    pageCount?: number;
    tableCount: number;
    textLength: number;
    processingTime: number;
  };
  provenance: Provenance;
}

export class FileProcessingService {
  private tesseractWorker: TesseractWorker;

  constructor() {
    this.tesseractWorker = new TesseractWorker();
  }

  async processFile(filePath: string, fileName: string, fileType: string): Promise<ProcessedFile> {
    const startTime = Date.now();
    logger.info(`Starting file processing: ${fileName}`);

    try {
      let extractedData: FinancialData[] = [];
      let metadata: any = {};

      switch (fileType) {
        case 'application/pdf':
          ({ extractedData, metadata } = await this.processPDF(filePath));
          break;
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.ms-excel':
          ({ extractedData, metadata } = await this.processExcel(filePath));
          break;
        case 'text/csv':
          ({ extractedData, metadata } = await this.processCSV(filePath));
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          ({ extractedData, metadata } = await this.processWord(filePath));
          break;
        case 'image/png':
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/gif':
        case 'image/bmp':
        case 'image/tiff':
          ({ extractedData, metadata } = await this.processImage(filePath));
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      const processingTime = Date.now() - startTime;

      const result: ProcessedFile = {
        id: this.generateFileId(),
        name: fileName,
        type: fileType,
        extractedData,
        metadata: {
          ...metadata,
          processingTime,
        },
        provenance: {
          source: 'file',
          filePath: fileName,
          extractionMethod: this.getExtractionMethod(fileType),
          timestamp: new Date().toISOString(),
        },
      };

      logger.info(`File processing completed: ${fileName}`, {
        processingTime,
        tablesExtracted: extractedData.length,
      });

      return result;
    } catch (error) {
      logger.error(`File processing failed: ${fileName}`, error);
      throw error;
    }
  }

  private async processPDF(filePath: string): Promise<{ extractedData: FinancialData[]; metadata: any }> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);

      // Extract text and identify financial tables
      const extractedData = await this.extractFinancialDataFromText(pdfData.text, 'pdf');
      
      return {
        extractedData,
        metadata: {
          pageCount: pdfData.numpages,
          textLength: pdfData.text.length,
          tableCount: extractedData.length,
        },
      };
    } catch (error) {
      logger.error('PDF processing error:', error);
      throw new Error('Failed to process PDF file');
    }
  }

  private async processExcel(filePath: string): Promise<{ extractedData: FinancialData[]; metadata: any }> {
    try {
      const workbook = XLSX.readFile(filePath);
      const extractedData: FinancialData[] = [];

      // Process each worksheet
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (this.isFinancialData(jsonData)) {
          const financialData = this.convertToFinancialData(jsonData, sheetName);
          if (financialData) {
            extractedData.push(financialData);
          }
        }
      });

      return {
        extractedData,
        metadata: {
          sheetCount: workbook.SheetNames.length,
          tableCount: extractedData.length,
          textLength: 0,
        },
      };
    } catch (error) {
      logger.error('Excel processing error:', error);
      throw new Error('Failed to process Excel file');
    }
  }

  private async processCSV(filePath: string): Promise<{ extractedData: FinancialData[]; metadata: any }> {
    try {
      const results: any[] = [];
      
      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            try {
              const extractedData: FinancialData[] = [];
              
              if (this.isFinancialData(results)) {
                const financialData = this.convertToFinancialData(results, 'CSV Data');
                if (financialData) {
                  extractedData.push(financialData);
                }
              }

              resolve({
                extractedData,
                metadata: {
                  rowCount: results.length,
                  tableCount: extractedData.length,
                  textLength: 0,
                },
              });
            } catch (error) {
              reject(error);
            }
          })
          .on('error', reject);
      });
    } catch (error) {
      logger.error('CSV processing error:', error);
      throw new Error('Failed to process CSV file');
    }
  }

  private async processWord(filePath: string): Promise<{ extractedData: FinancialData[]; metadata: any }> {
    try {
      const buffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer });

      const extractedData = await this.extractFinancialDataFromText(result.value, 'word');
      
      return {
        extractedData,
        metadata: {
          textLength: result.value.length,
          tableCount: extractedData.length,
        },
      };
    } catch (error) {
      logger.error('Word processing error:', error);
      throw new Error('Failed to process Word file');
    }
  }

  private async processImage(filePath: string): Promise<{ extractedData: FinancialData[]; metadata: any }> {
    try {
      // Preprocess image for better OCR
      const processedImagePath = await this.preprocessImage(filePath);
      
      // Perform OCR
      const { data: { text } } = await this.tesseractWorker.recognize(processedImagePath);
      
      // Clean up processed image
      if (processedImagePath !== filePath) {
        fs.unlinkSync(processedImagePath);
      }

      const extractedData = await this.extractFinancialDataFromText(text, 'image');
      
      return {
        extractedData,
        metadata: {
          textLength: text.length,
          tableCount: extractedData.length,
        },
      };
    } catch (error) {
      logger.error('Image processing error:', error);
      throw new Error('Failed to process image file');
    }
  }

  private async preprocessImage(filePath: string): Promise<string> {
    try {
      const processedPath = filePath.replace(/\.[^/.]+$/, '_processed.png');
      
      await sharp(filePath)
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .grayscale()
        .normalize()
        .sharpen()
        .png()
        .toFile(processedPath);

      return processedPath;
    } catch (error) {
      logger.warn('Image preprocessing failed, using original:', error);
      return filePath;
    }
  }

  private async extractFinancialDataFromText(text: string, sourceType: string): Promise<FinancialData[]> {
    const extractedData: FinancialData[] = [];
    
    // Look for financial statement patterns
    const patterns = [
      // Income Statement patterns
      {
        type: 'income_statement' as const,
        regex: /(?:income\s+statement|profit\s+and\s+loss|p&l)/i,
        extractor: this.extractIncomeStatementData.bind(this),
      },
      // Balance Sheet patterns
      {
        type: 'balance_sheet' as const,
        regex: /(?:balance\s+sheet|statement\s+of\s+financial\s+position)/i,
        extractor: this.extractBalanceSheetData.bind(this),
      },
      // Cash Flow patterns
      {
        type: 'cash_flow' as const,
        regex: /(?:cash\s+flow|statement\s+of\s+cash\s+flows)/i,
        extractor: this.extractCashFlowData.bind(this),
      },
    ];

    for (const pattern of patterns) {
      if (pattern.regex.test(text)) {
        const data = pattern.extractor(text);
        if (data) {
          extractedData.push({
            id: this.generateDataId(),
            type: pattern.type,
            period: this.extractPeriod(text),
            values: data,
            metadata: {
              currency: this.extractCurrency(text),
              units: 'millions',
              source: {
                source: 'file',
                filePath: sourceType,
                extractionMethod: 'pattern_matching',
                timestamp: new Date().toISOString(),
              },
            },
          });
        }
      }
    }

    return extractedData;
  }

  private extractIncomeStatementData(text: string): any {
    // Extract revenue, expenses, profit data
    const revenueMatch = text.match(/revenue[:\s]*\$?([\d,]+(?:\.\d+)?)/i);
    const profitMatch = text.match(/net\s+income[:\s]*\$?([\d,]+(?:\.\d+)?)/i);
    
    if (revenueMatch || profitMatch) {
      return {
        revenue: revenueMatch ? parseFloat(revenueMatch[1].replace(/,/g, '')) : 0,
        netIncome: profitMatch ? parseFloat(profitMatch[1].replace(/,/g, '')) : 0,
      };
    }
    
    return null;
  }

  private extractBalanceSheetData(text: string): any {
    // Extract assets, liabilities, equity data
    const assetsMatch = text.match(/total\s+assets[:\s]*\$?([\d,]+(?:\.\d+)?)/i);
    const liabilitiesMatch = text.match(/total\s+liabilities[:\s]*\$?([\d,]+(?:\.\d+)?)/i);
    
    if (assetsMatch || liabilitiesMatch) {
      return {
        totalAssets: assetsMatch ? parseFloat(assetsMatch[1].replace(/,/g, '')) : 0,
        totalLiabilities: liabilitiesMatch ? parseFloat(liabilitiesMatch[1].replace(/,/g, '')) : 0,
      };
    }
    
    return null;
  }

  private extractCashFlowData(text: string): any {
    // Extract operating, investing, financing cash flows
    const operatingMatch = text.match(/operating\s+cash\s+flow[:\s]*\$?([\d,]+(?:\.\d+)?)/i);
    const investingMatch = text.match(/investing\s+cash\s+flow[:\s]*\$?([\d,]+(?:\.\d+)?)/i);
    
    if (operatingMatch || investingMatch) {
      return {
        operatingCashFlow: operatingMatch ? parseFloat(operatingMatch[1].replace(/,/g, '')) : 0,
        investingCashFlow: investingMatch ? parseFloat(investingMatch[1].replace(/,/g, '')) : 0,
      };
    }
    
    return null;
  }

  private isFinancialData(data: any[]): boolean {
    if (!Array.isArray(data) || data.length < 2) return false;
    
    // Check for financial keywords in headers
    const headers = data[0];
    if (!Array.isArray(headers)) return false;
    
    const financialKeywords = [
      'revenue', 'income', 'profit', 'loss', 'assets', 'liabilities',
      'equity', 'cash', 'debt', 'sales', 'expenses', 'costs',
      'earnings', 'ebitda', 'margin', 'ratio', 'growth', 'return'
    ];
    
    const headerText = headers.join(' ').toLowerCase();
    return financialKeywords.some(keyword => headerText.includes(keyword));
  }

  private convertToFinancialData(data: any[], sheetName: string): FinancialData | null {
    try {
      if (!this.isFinancialData(data)) return null;
      
      const headers = data[0];
      const rows = data.slice(1);
      
      const values: any = {};
      
      // Convert rows to key-value pairs
      rows.forEach((row: any[]) => {
        if (row.length >= 2 && row[0] && row[1]) {
          const key = String(row[0]).trim();
          const value = this.parseNumericValue(row[1]);
          if (!isNaN(value)) {
            values[key] = value;
          }
        }
      });
      
      return {
        id: this.generateDataId(),
        type: this.determineFinancialType(headers),
        period: this.extractPeriod(sheetName),
        values,
        metadata: {
          currency: 'USD',
          units: 'millions',
          source: {
            source: 'file',
            filePath: sheetName,
            extractionMethod: 'structured_parsing',
            timestamp: new Date().toISOString(),
          },
        },
      };
    } catch (error) {
      logger.error('Error converting to financial data:', error);
      return null;
    }
  }

  private parseNumericValue(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Remove currency symbols, commas, and parentheses
      const cleaned = value.replace(/[$,\s()]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  private determineFinancialType(headers: any[]): 'income_statement' | 'balance_sheet' | 'cash_flow' | 'transaction_data' | 'market_data' {
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

  private extractCurrency(text: string): string {
    if (text.includes('$') || text.toLowerCase().includes('dollar')) return 'USD';
    if (text.includes('€') || text.toLowerCase().includes('euro')) return 'EUR';
    if (text.includes('£') || text.toLowerCase().includes('pound')) return 'GBP';
    if (text.includes('¥') || text.toLowerCase().includes('yen')) return 'JPY';
    return 'USD';
  }

  private getExtractionMethod(fileType: string): string {
    switch (fileType) {
      case 'application/pdf': return 'pdf_parsing';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': return 'excel_parsing';
      case 'text/csv': return 'csv_parsing';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'word_parsing';
      default: return 'ocr_extraction';
    }
  }

  private generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDataId(): string {
    return `data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async cleanup(): Promise<void> {
    if (this.tesseractWorker) {
      await this.tesseractWorker.terminate();
    }
  }
}

import { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import { WebScrapingService } from '../services/webScrapingService';
import { APIResponse, WebScrapeRequest, WebScrapeResult } from '@shared/types';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class ScrapingController {
  private db = getDatabase();
  private webScrapingService = new WebScrapingService();

  async scrape(req: Request, res: Response) {
    try {
      const request: WebScrapeRequest = req.body;
      
      if (!request.url) {
        return res.status(400).json({
          success: false,
          error: 'URL is required',
          timestamp: new Date().toISOString(),
        });
      }

      // Validate URL
      try {
        new URL(request.url);
      } catch {
        return res.status(400).json({
          success: false,
          error: 'Invalid URL format',
          timestamp: new Date().toISOString(),
        });
      }

      // Save scrape request to database
      const webScrape = await this.db.webScrape.create({
        data: {
          id: uuidv4(),
          userId: req.user!.id,
          url: request.url,
          status: 'PENDING',
        },
      });

      // Process scrape in background
      this.processScrapeAsync(webScrape.id, request);

      res.status(201).json({
        success: true,
        data: {
          id: webScrape.id,
          url: webScrape.url,
          status: webScrape.status,
          createdAt: webScrape.createdAt.toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Web scraping error:', error);
      res.status(500).json({
        success: false,
        error: 'Web scraping failed',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getResults(req: Request, res: Response) {
    try {
      const scrapes = await this.db.webScrape.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' },
      });

      const response: WebScrapeResult[] = scrapes.map(scrape => ({
        id: scrape.id,
        url: scrape.url,
        title: scrape.title || '',
        extractedData: scrape.extractedData as any,
        status: scrape.status.toLowerCase() as any,
        error: scrape.error || undefined,
        scrapedAt: scrape.createdAt.toISOString(),
      }));

      res.json({
        success: true,
        data: response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error getting scrape results:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve scrape results',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const webScrape = await this.db.webScrape.findUnique({
        where: { id, userId: req.user!.id },
      });

      if (!webScrape) {
        return res.status(404).json({
          success: false,
          error: 'Scrape result not found',
          timestamp: new Date().toISOString(),
        });
      }

      // Delete from database
      await this.db.webScrape.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Scrape result deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error deleting scrape result:', error);
      res.status(500).json({
        success: false,
        error: 'Scrape result deletion failed',
        timestamp: new Date().toISOString(),
      });
    }
  }

  private async processScrapeAsync(scrapeId: string, request: WebScrapeRequest): Promise<void> {
    try {
      logger.info(`Processing web scrape: ${request.url}`);

      // Update status to processing
      await this.db.webScrape.update({
        where: { id: scrapeId },
        data: { status: 'PROCESSING' },
      });

      // Perform the scrape
      const result = await this.webScrapingService.scrapeUrl(request);

      // Update database with results
      await this.db.webScrape.update({
        where: { id: scrapeId },
        data: {
          status: result.status === 'success' ? 'COMPLETED' : 'ERROR',
          title: result.title,
          extractedData: result.extractedData,
          error: result.error,
        },
      });

      logger.info(`Web scrape completed: ${request.url}`, {
        status: result.status,
        tablesFound: result.extractedData.tables.length,
      });
    } catch (error) {
      logger.error(`Web scrape failed: ${request.url}`, error);
      
      // Update database with error
      await this.db.webScrape.update({
        where: { id: scrapeId },
        data: {
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }
}

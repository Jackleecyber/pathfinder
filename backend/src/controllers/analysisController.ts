import { Request, Response } from 'express';
import { FinancialAnalysisService } from '../services/financialAnalysisService';
import { APIResponse, FinancialData } from '@shared/types';
import { logger } from '../utils/logger';

export class AnalysisController {
  private financialAnalysisService = new FinancialAnalysisService();

  async analyzeFinancials(req: Request, res: Response) {
    try {
      const { data } = req.body;
      
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({
          success: false,
          error: 'Financial data array is required',
          timestamp: new Date().toISOString(),
        });
      }

      const analysis = await this.financialAnalysisService.analyzeFinancials(data);

      res.json({
        success: true,
        data: analysis,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Financial analysis error:', error);
      res.status(500).json({
        success: false,
        error: 'Financial analysis failed',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async generateModel(req: Request, res: Response) {
    try {
      const { type, inputs, data } = req.body;
      
      if (!type || !data) {
        return res.status(400).json({
          success: false,
          error: 'Model type and financial data are required',
          timestamp: new Date().toISOString(),
        });
      }

      let model: any;

      switch (type) {
        case 'dcf':
          model = await this.financialAnalysisService.generateDCFModel(data, inputs);
          break;
        case 'comparable':
          model = await this.financialAnalysisService.generateComparableAnalysis(data, inputs?.peerData || []);
          break;
        case 'valuation':
          model = await this.financialAnalysisService.calculateValuationMetrics(data, inputs?.marketData);
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Unsupported model type',
            timestamp: new Date().toISOString(),
          });
      }

      res.json({
        success: true,
        data: {
          type,
          model,
          generatedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Model generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Model generation failed',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async calculateMetrics(req: Request, res: Response) {
    try {
      const { data, metrics } = req.body;
      
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({
          success: false,
          error: 'Financial data array is required',
          timestamp: new Date().toISOString(),
        });
      }

      const requestedMetrics = metrics || ['profitability', 'liquidity', 'leverage', 'efficiency'];
      const analysis = await this.financialAnalysisService.analyzeFinancials(data);
      
      // Filter metrics based on request
      const filteredMetrics: any = {};
      requestedMetrics.forEach((metric: string) => {
        if (analysis.metrics[metric as keyof typeof analysis.metrics]) {
          filteredMetrics[metric] = analysis.metrics[metric as keyof typeof analysis.metrics];
        }
      });

      res.json({
        success: true,
        data: {
          metrics: filteredMetrics,
          insights: analysis.insights,
          recommendations: analysis.recommendations,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Metrics calculation error:', error);
      res.status(500).json({
        success: false,
        error: 'Metrics calculation failed',
        timestamp: new Date().toISOString(),
      });
    }
  }
}

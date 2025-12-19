import { FinancialData, FinancialModel } from '@shared/types';
import { logger } from '../utils/logger';

export interface FinancialMetrics {
  profitability: {
    grossMargin: number;
    operatingMargin: number;
    netMargin: number;
    roe: number;
    roa: number;
  };
  liquidity: {
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
  };
  leverage: {
    debtToEquity: number;
    debtToAssets: number;
    interestCoverage: number;
  };
  efficiency: {
    assetTurnover: number;
    inventoryTurnover: number;
    receivablesTurnover: number;
  };
  growth: {
    revenueGrowth: number;
    profitGrowth: number;
    assetGrowth: number;
  };
}

export interface ValuationMetrics {
  peRatio: number;
  pbRatio: number;
  evToEbitda: number;
  priceToSales: number;
  dividendYield: number;
}

export interface DCFModel {
  assumptions: {
    revenueGrowth: number[];
    marginEvolution: number[];
    terminalGrowth: number;
    discountRate: number;
  };
  projections: {
    years: number[];
    revenue: number[];
    ebitda: number[];
    freeCashFlow: number[];
    presentValue: number[];
  };
  valuation: {
    enterpriseValue: number;
    equityValue: number;
    sharePrice: number;
  };
}

export class FinancialAnalysisService {
  async analyzeFinancials(data: FinancialData[]): Promise<{
    metrics: FinancialMetrics;
    insights: string[];
    recommendations: string[];
  }> {
    try {
      logger.info('Starting financial analysis', { dataCount: data.length });

      // Separate data by type
      const incomeStatement = data.find(d => d.type === 'income_statement');
      const balanceSheet = data.find(d => d.type === 'balance_sheet');
      const cashFlow = data.find(d => d.type === 'cash_flow');

      if (!incomeStatement && !balanceSheet) {
        throw new Error('Insufficient financial data for analysis');
      }

      // Calculate metrics
      const metrics = this.calculateFinancialMetrics(incomeStatement, balanceSheet, cashFlow);
      
      // Generate insights
      const insights = this.generateInsights(metrics, incomeStatement, balanceSheet);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(metrics, insights);

      return {
        metrics,
        insights,
        recommendations,
      };
    } catch (error) {
      logger.error('Financial analysis failed:', error);
      throw error;
    }
  }

  async generateDCFModel(data: FinancialData[], assumptions?: any): Promise<DCFModel> {
    try {
      const incomeStatement = data.find(d => d.type === 'income_statement');
      const balanceSheet = data.find(d => d.type === 'balance_sheet');

      if (!incomeStatement) {
        throw new Error('Income statement required for DCF model');
      }

      const model = this.buildDCFModel(incomeStatement, balanceSheet, assumptions);
      
      logger.info('DCF model generated successfully');
      return model;
    } catch (error) {
      logger.error('DCF model generation failed:', error);
      throw error;
    }
  }

  async calculateValuationMetrics(data: FinancialData[], marketData?: any): Promise<ValuationMetrics> {
    try {
      const incomeStatement = data.find(d => d.type === 'income_statement');
      const balanceSheet = data.find(d => d.type === 'balance_sheet');

      if (!incomeStatement || !balanceSheet) {
        throw new Error('Income statement and balance sheet required for valuation');
      }

      const metrics = this.computeValuationMetrics(incomeStatement, balanceSheet, marketData);
      
      return metrics;
    } catch (error) {
      logger.error('Valuation metrics calculation failed:', error);
      throw error;
    }
  }

  private calculateFinancialMetrics(
    incomeStatement?: FinancialData,
    balanceSheet?: FinancialData,
    cashFlow?: FinancialData
  ): FinancialMetrics {
    const metrics: FinancialMetrics = {
      profitability: {
        grossMargin: 0,
        operatingMargin: 0,
        netMargin: 0,
        roe: 0,
        roa: 0,
      },
      liquidity: {
        currentRatio: 0,
        quickRatio: 0,
        cashRatio: 0,
      },
      leverage: {
        debtToEquity: 0,
        debtToAssets: 0,
        interestCoverage: 0,
      },
      efficiency: {
        assetTurnover: 0,
        inventoryTurnover: 0,
        receivablesTurnover: 0,
      },
      growth: {
        revenueGrowth: 0,
        profitGrowth: 0,
        assetGrowth: 0,
      },
    };

    if (incomeStatement) {
      const revenue = this.getNumericValue(incomeStatement, 'revenue', 'total revenue', 'sales');
      const grossProfit = this.getNumericValue(incomeStatement, 'gross profit', 'gross income');
      const operatingIncome = this.getNumericValue(incomeStatement, 'operating income', 'ebit', 'operating profit');
      const netIncome = this.getNumericValue(incomeStatement, 'net income', 'net profit', 'profit after tax');

      // Profitability ratios
      if (revenue > 0) {
        metrics.profitability.grossMargin = grossProfit / revenue;
        metrics.profitability.operatingMargin = operatingIncome / revenue;
        metrics.profitability.netMargin = netIncome / revenue;
      }
    }

    if (balanceSheet) {
      const totalAssets = this.getNumericValue(balanceSheet, 'total assets', 'assets');
      const currentAssets = this.getNumericValue(balanceSheet, 'current assets', 'total current assets');
      const currentLiabilities = this.getNumericValue(balanceSheet, 'current liabilities', 'total current liabilities');
      const totalDebt = this.getNumericValue(balanceSheet, 'total debt', 'total liabilities');
      const shareholdersEquity = this.getNumericValue(balanceSheet, 'shareholders equity', 'total equity', 'stockholders equity');
      const cash = this.getNumericValue(balanceSheet, 'cash', 'cash and cash equivalents');

      // Liquidity ratios
      if (currentLiabilities > 0) {
        metrics.liquidity.currentRatio = currentAssets / currentLiabilities;
        metrics.liquidity.quickRatio = (currentAssets - this.getNumericValue(balanceSheet, 'inventory')) / currentLiabilities;
        metrics.liquidity.cashRatio = cash / currentLiabilities;
      }

      // Leverage ratios
      if (shareholdersEquity > 0) {
        metrics.leverage.debtToEquity = totalDebt / shareholdersEquity;
      }
      if (totalAssets > 0) {
        metrics.leverage.debtToAssets = totalDebt / totalAssets;
      }

      // ROE and ROA
      if (incomeStatement) {
        const netIncome = this.getNumericValue(incomeStatement, 'net income', 'net profit');
        if (shareholdersEquity > 0) {
          metrics.profitability.roe = netIncome / shareholdersEquity;
        }
        if (totalAssets > 0) {
          metrics.profitability.roa = netIncome / totalAssets;
        }
      }
    }

    return metrics;
  }

  private buildDCFModel(
    incomeStatement: FinancialData,
    balanceSheet?: FinancialData,
    assumptions?: any
  ): DCFModel {
    const currentRevenue = this.getNumericValue(incomeStatement, 'revenue', 'total revenue', 'sales');
    const currentEbitda = this.getNumericValue(incomeStatement, 'ebitda', 'operating income');
    
    // Default assumptions
    const defaultAssumptions = {
      revenueGrowth: [0.1, 0.08, 0.06, 0.05, 0.04], // 5-year growth rates
      marginEvolution: [0.15, 0.16, 0.17, 0.18, 0.19], // EBITDA margins
      terminalGrowth: 0.03, // 3% terminal growth
      discountRate: 0.10, // 10% WACC
    };

    const finalAssumptions = { ...defaultAssumptions, ...assumptions };

    // Build projections
    const years = [1, 2, 3, 4, 5];
    const revenue: number[] = [];
    const ebitda: number[] = [];
    const freeCashFlow: number[] = [];
    const presentValue: number[] = [];

    let projectedRevenue = currentRevenue;
    let cumulativePV = 0;

    years.forEach((year, index) => {
      // Project revenue
      projectedRevenue *= (1 + finalAssumptions.revenueGrowth[index]);
      revenue.push(projectedRevenue);

      // Project EBITDA
      const projectedEbitda = projectedRevenue * finalAssumptions.marginEvolution[index];
      ebitda.push(projectedEbitda);

      // Estimate free cash flow (simplified: EBITDA - CapEx - Working Capital)
      const capex = projectedRevenue * 0.05; // Assume 5% of revenue
      const workingCapitalChange = projectedRevenue * 0.02; // Assume 2% of revenue
      const fcf = projectedEbitda - capex - workingCapitalChange;
      freeCashFlow.push(fcf);

      // Calculate present value
      const pv = fcf / Math.pow(1 + finalAssumptions.discountRate, year);
      presentValue.push(pv);
      cumulativePV += pv;
    });

    // Terminal value
    const terminalFCF = freeCashFlow[4] * (1 + finalAssumptions.terminalGrowth);
    const terminalValue = terminalFCF / (finalAssumptions.discountRate - finalAssumptions.terminalGrowth);
    const terminalPV = terminalValue / Math.pow(1 + finalAssumptions.discountRate, 5);

    const enterpriseValue = cumulativePV + terminalPV;
    const equityValue = enterpriseValue; // Simplified (no net debt adjustment)
    const sharePrice = equityValue / 1000000000; // Assume 1B shares

    return {
      assumptions: finalAssumptions,
      projections: {
        years,
        revenue,
        ebitda,
        freeCashFlow,
        presentValue,
      },
      valuation: {
        enterpriseValue,
        equityValue,
        sharePrice,
      },
    };
  }

  private computeValuationMetrics(
    incomeStatement: FinancialData,
    balanceSheet: FinancialData,
    marketData?: any
  ): ValuationMetrics {
    const netIncome = this.getNumericValue(incomeStatement, 'net income', 'net profit');
    const revenue = this.getNumericValue(incomeStatement, 'revenue', 'total revenue', 'sales');
    const shareholdersEquity = this.getNumericValue(balanceSheet, 'shareholders equity', 'total equity');
    const totalAssets = this.getNumericValue(balanceSheet, 'total assets');

    // Default market data if not provided
    const defaultMarketData = {
      marketCap: 1000000000, // $1B
      sharePrice: 100,
      sharesOutstanding: 10000000,
      enterpriseValue: 1200000000, // $1.2B
    };

    const market = { ...defaultMarketData, ...marketData };

    return {
      peRatio: market.sharePrice / (netIncome / market.sharesOutstanding),
      pbRatio: market.marketCap / shareholdersEquity,
      evToEbitda: market.enterpriseValue / this.getNumericValue(incomeStatement, 'ebitda', 'operating income'),
      priceToSales: market.marketCap / revenue,
      dividendYield: 0.03, // Assume 3% dividend yield
    };
  }

  private generateInsights(
    metrics: FinancialMetrics,
    incomeStatement?: FinancialData,
    balanceSheet?: FinancialData
  ): string[] {
    const insights: string[] = [];

    // Profitability insights
    if (metrics.profitability.netMargin > 0.15) {
      insights.push('Strong profitability with net margin above 15%');
    } else if (metrics.profitability.netMargin < 0.05) {
      insights.push('Low profitability - net margin below 5%');
    }

    if (metrics.profitability.roe > 0.15) {
      insights.push('Excellent return on equity above 15%');
    } else if (metrics.profitability.roe < 0.05) {
      insights.push('Poor return on equity below 5%');
    }

    // Liquidity insights
    if (metrics.liquidity.currentRatio > 2) {
      insights.push('Strong liquidity position with current ratio above 2');
    } else if (metrics.liquidity.currentRatio < 1) {
      insights.push('Liquidity concerns - current ratio below 1');
    }

    // Leverage insights
    if (metrics.leverage.debtToEquity > 1) {
      insights.push('High leverage - debt exceeds equity');
    } else if (metrics.leverage.debtToEquity < 0.3) {
      insights.push('Conservative leverage - low debt to equity ratio');
    }

    return insights;
  }

  private generateRecommendations(metrics: FinancialMetrics, insights: string[]): string[] {
    const recommendations: string[] = [];

    // Profitability recommendations
    if (metrics.profitability.netMargin < 0.05) {
      recommendations.push('Focus on cost reduction and operational efficiency');
      recommendations.push('Review pricing strategy to improve margins');
    }

    // Liquidity recommendations
    if (metrics.liquidity.currentRatio < 1) {
      recommendations.push('Improve working capital management');
      recommendations.push('Consider raising additional capital');
    }

    // Leverage recommendations
    if (metrics.leverage.debtToEquity > 1) {
      recommendations.push('Reduce debt levels to improve financial stability');
      recommendations.push('Consider equity financing for growth initiatives');
    }

    // Growth recommendations
    if (metrics.growth.revenueGrowth < 0.05) {
      recommendations.push('Develop new products or markets for growth');
      recommendations.push('Consider strategic acquisitions');
    }

    return recommendations;
  }

  private getNumericValue(data: FinancialData, ...keys: string[]): number {
    for (const key of keys) {
      const value = data.values[key];
      if (value !== undefined && typeof value === 'number' && !isNaN(value)) {
        return value;
      }
    }
    return 0;
  }

  async generateComparableAnalysis(companyData: FinancialData[], peerData: FinancialData[]): Promise<{
    companyMetrics: FinancialMetrics;
    peerMetrics: FinancialMetrics[];
    comparison: {
      relativePerformance: string[];
      strengths: string[];
      weaknesses: string[];
    };
  }> {
    try {
      const companyMetrics = await this.analyzeFinancials(companyData);
      const peerMetrics: FinancialMetrics[] = [];

      for (const peer of peerData) {
        const peerAnalysis = await this.analyzeFinancials([peer]);
        peerMetrics.push(peerAnalysis.metrics);
      }

      const comparison = this.compareMetrics(companyMetrics.metrics, peerMetrics);

      return {
        companyMetrics: companyMetrics.metrics,
        peerMetrics,
        comparison,
      };
    } catch (error) {
      logger.error('Comparable analysis failed:', error);
      throw error;
    }
  }

  private compareMetrics(companyMetrics: FinancialMetrics, peerMetrics: FinancialMetrics[]): {
    relativePerformance: string[];
    strengths: string[];
    weaknesses: string[];
  } {
    const relativePerformance: string[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Calculate peer averages
    const avgPeerMetrics = this.calculateAverageMetrics(peerMetrics);

    // Compare profitability
    if (companyMetrics.profitability.netMargin > avgPeerMetrics.profitability.netMargin) {
      strengths.push('Above-average net margin');
    } else {
      weaknesses.push('Below-average net margin');
    }

    if (companyMetrics.profitability.roe > avgPeerMetrics.profitability.roe) {
      strengths.push('Superior return on equity');
    } else {
      weaknesses.push('Below-average return on equity');
    }

    // Compare liquidity
    if (companyMetrics.liquidity.currentRatio > avgPeerMetrics.liquidity.currentRatio) {
      strengths.push('Strong liquidity position');
    } else {
      weaknesses.push('Weaker liquidity than peers');
    }

    // Compare leverage
    if (companyMetrics.leverage.debtToEquity < avgPeerMetrics.leverage.debtToEquity) {
      strengths.push('Conservative leverage profile');
    } else {
      weaknesses.push('Higher leverage than peers');
    }

    return {
      relativePerformance,
      strengths,
      weaknesses,
    };
  }

  private calculateAverageMetrics(metrics: FinancialMetrics[]): FinancialMetrics {
    if (metrics.length === 0) {
      return {
        profitability: { grossMargin: 0, operatingMargin: 0, netMargin: 0, roe: 0, roa: 0 },
        liquidity: { currentRatio: 0, quickRatio: 0, cashRatio: 0 },
        leverage: { debtToEquity: 0, debtToAssets: 0, interestCoverage: 0 },
        efficiency: { assetTurnover: 0, inventoryTurnover: 0, receivablesTurnover: 0 },
        growth: { revenueGrowth: 0, profitGrowth: 0, assetGrowth: 0 },
      };
    }

    const sum = metrics.reduce((acc, metric) => ({
      profitability: {
        grossMargin: acc.profitability.grossMargin + metric.profitability.grossMargin,
        operatingMargin: acc.profitability.operatingMargin + metric.profitability.operatingMargin,
        netMargin: acc.profitability.netMargin + metric.profitability.netMargin,
        roe: acc.profitability.roe + metric.profitability.roe,
        roa: acc.profitability.roa + metric.profitability.roa,
      },
      liquidity: {
        currentRatio: acc.liquidity.currentRatio + metric.liquidity.currentRatio,
        quickRatio: acc.liquidity.quickRatio + metric.liquidity.quickRatio,
        cashRatio: acc.liquidity.cashRatio + metric.liquidity.cashRatio,
      },
      leverage: {
        debtToEquity: acc.leverage.debtToEquity + metric.leverage.debtToEquity,
        debtToAssets: acc.leverage.debtToAssets + metric.leverage.debtToAssets,
        interestCoverage: acc.leverage.interestCoverage + metric.leverage.interestCoverage,
      },
      efficiency: {
        assetTurnover: acc.efficiency.assetTurnover + metric.efficiency.assetTurnover,
        inventoryTurnover: acc.efficiency.inventoryTurnover + metric.efficiency.inventoryTurnover,
        receivablesTurnover: acc.efficiency.receivablesTurnover + metric.efficiency.receivablesTurnover,
      },
      growth: {
        revenueGrowth: acc.growth.revenueGrowth + metric.growth.revenueGrowth,
        profitGrowth: acc.growth.profitGrowth + metric.growth.profitGrowth,
        assetGrowth: acc.growth.assetGrowth + metric.growth.assetGrowth,
      },
    }), {
      profitability: { grossMargin: 0, operatingMargin: 0, netMargin: 0, roe: 0, roa: 0 },
      liquidity: { currentRatio: 0, quickRatio: 0, cashRatio: 0 },
      leverage: { debtToEquity: 0, debtToAssets: 0, interestCoverage: 0 },
      efficiency: { assetTurnover: 0, inventoryTurnover: 0, receivablesTurnover: 0 },
      growth: { revenueGrowth: 0, profitGrowth: 0, assetGrowth: 0 },
    });

    const count = metrics.length;
    return {
      profitability: {
        grossMargin: sum.profitability.grossMargin / count,
        operatingMargin: sum.profitability.operatingMargin / count,
        netMargin: sum.profitability.netMargin / count,
        roe: sum.profitability.roe / count,
        roa: sum.profitability.roa / count,
      },
      liquidity: {
        currentRatio: sum.liquidity.currentRatio / count,
        quickRatio: sum.liquidity.quickRatio / count,
        cashRatio: sum.liquidity.cashRatio / count,
      },
      leverage: {
        debtToEquity: sum.leverage.debtToEquity / count,
        debtToAssets: sum.leverage.debtToAssets / count,
        interestCoverage: sum.leverage.interestCoverage / count,
      },
      efficiency: {
        assetTurnover: sum.efficiency.assetTurnover / count,
        inventoryTurnover: sum.efficiency.inventoryTurnover / count,
        receivablesTurnover: sum.efficiency.receivablesTurnover / count,
      },
      growth: {
        revenueGrowth: sum.growth.revenueGrowth / count,
        profitGrowth: sum.growth.profitGrowth / count,
        assetGrowth: sum.growth.assetGrowth / count,
      },
    };
  }
}

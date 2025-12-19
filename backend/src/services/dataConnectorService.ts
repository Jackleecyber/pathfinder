import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';
import { FinancialData, DataConnector } from '@shared/types';

export interface ConnectorConfig {
  apiKey: string;
  endpoint: string;
  username?: string;
  password?: string;
  timeout?: number;
}

export interface DataRequest {
  symbols: string[];
  fields: string[];
  startDate?: string;
  endDate?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
}

export interface MarketData {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
}

export interface CompanyData {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  employees: number;
  headquarters: string;
}

export class DataConnectorService {
  private connectors: Map<string, AxiosInstance> = new Map();

  constructor() {
    this.initializeConnectors();
  }

  private initializeConnectors(): void {
    // Initialize Bloomberg connector
    if (config.dataProviders.bloomberg.apiKey) {
      this.connectors.set('bloomberg', axios.create({
        baseURL: config.dataProviders.bloomberg.endpoint,
        headers: {
          'Authorization': `Bearer ${config.dataProviders.bloomberg.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }));
    }

    // Initialize FactSet connector
    if (config.dataProviders.factset.apiKey) {
      this.connectors.set('factset', axios.create({
        baseURL: config.dataProviders.factset.endpoint,
        headers: {
          'X-API-Key': config.dataProviders.factset.apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }));
    }

    // Initialize Capital IQ connector
    if (config.dataProviders.capiq.apiKey) {
      this.connectors.set('capiq', axios.create({
        baseURL: config.dataProviders.capiq.endpoint,
        headers: {
          'Authorization': `Bearer ${config.dataProviders.capiq.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }));
    }

    // Initialize Refinitiv connector
    if (config.dataProviders.refinitiv.apiKey) {
      this.connectors.set('refinitiv', axios.create({
        baseURL: config.dataProviders.refinitiv.endpoint,
        headers: {
          'X-API-Key': config.dataProviders.refinitiv.apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }));
    }

    // Initialize PitchBook connector
    if (config.dataProviders.pitchbook.apiKey) {
      this.connectors.set('pitchbook', axios.create({
        baseURL: config.dataProviders.pitchbook.endpoint,
        headers: {
          'Authorization': `Bearer ${config.dataProviders.pitchbook.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }));
    }
  }

  async getMarketData(connectorType: string, request: DataRequest): Promise<MarketData[]> {
    try {
      const connector = this.connectors.get(connectorType);
      if (!connector) {
        throw new Error(`Connector ${connectorType} not available`);
      }

      logger.info(`Fetching market data from ${connectorType}`, { symbols: request.symbols });

      let response: any;

      switch (connectorType) {
        case 'bloomberg':
          response = await this.fetchBloombergData(connector, request);
          break;
        case 'factset':
          response = await this.fetchFactSetData(connector, request);
          break;
        case 'capiq':
          response = await this.fetchCapitalIQData(connector, request);
          break;
        case 'refinitiv':
          response = await this.fetchRefinitivData(connector, request);
          break;
        default:
          throw new Error(`Unsupported connector type: ${connectorType}`);
      }

      return this.parseMarketData(response, connectorType);
    } catch (error) {
      logger.error(`Error fetching market data from ${connectorType}:`, error);
      throw error;
    }
  }

  async getCompanyData(connectorType: string, symbols: string[]): Promise<CompanyData[]> {
    try {
      const connector = this.connectors.get(connectorType);
      if (!connector) {
        throw new Error(`Connector ${connectorType} not available`);
      }

      logger.info(`Fetching company data from ${connectorType}`, { symbols });

      let response: any;

      switch (connectorType) {
        case 'bloomberg':
          response = await this.fetchBloombergCompanyData(connector, symbols);
          break;
        case 'factset':
          response = await this.fetchFactSetCompanyData(connector, symbols);
          break;
        case 'capiq':
          response = await this.fetchCapitalIQCompanyData(connector, symbols);
          break;
        case 'refinitiv':
          response = await this.fetchRefinitivCompanyData(connector, symbols);
          break;
        default:
          throw new Error(`Unsupported connector type: ${connectorType}`);
      }

      return this.parseCompanyData(response, connectorType);
    } catch (error) {
      logger.error(`Error fetching company data from ${connectorType}:`, error);
      throw error;
    }
  }

  async getFinancialStatements(connectorType: string, symbols: string[], period: string = 'annual'): Promise<FinancialData[]> {
    try {
      const connector = this.connectors.get(connectorType);
      if (!connector) {
        throw new Error(`Connector ${connectorType} not available`);
      }

      logger.info(`Fetching financial statements from ${connectorType}`, { symbols, period });

      let response: any;

      switch (connectorType) {
        case 'bloomberg':
          response = await this.fetchBloombergFinancials(connector, symbols, period);
          break;
        case 'factset':
          response = await this.fetchFactSetFinancials(connector, symbols, period);
          break;
        case 'capiq':
          response = await this.fetchCapitalIQFinancials(connector, symbols, period);
          break;
        case 'refinitiv':
          response = await this.fetchRefinitivFinancials(connector, symbols, period);
          break;
        default:
          throw new Error(`Unsupported connector type: ${connectorType}`);
      }

      return this.parseFinancialStatements(response, connectorType);
    } catch (error) {
      logger.error(`Error fetching financial statements from ${connectorType}:`, error);
      throw error;
    }
  }

  async getAnalystEstimates(connectorType: string, symbols: string[]): Promise<any[]> {
    try {
      const connector = this.connectors.get(connectorType);
      if (!connector) {
        throw new Error(`Connector ${connectorType} not available`);
      }

      logger.info(`Fetching analyst estimates from ${connectorType}`, { symbols });

      let response: any;

      switch (connectorType) {
        case 'bloomberg':
          response = await this.fetchBloombergEstimates(connector, symbols);
          break;
        case 'factset':
          response = await this.fetchFactSetEstimates(connector, symbols);
          break;
        case 'capiq':
          response = await this.fetchCapitalIQEstimates(connector, symbols);
          break;
        case 'refinitiv':
          response = await this.fetchRefinitivEstimates(connector, symbols);
          break;
        default:
          throw new Error(`Unsupported connector type: ${connectorType}`);
      }

      return this.parseAnalystEstimates(response, connectorType);
    } catch (error) {
      logger.error(`Error fetching analyst estimates from ${connectorType}:`, error);
      throw error;
    }
  }

  // Bloomberg API methods
  private async fetchBloombergData(connector: AxiosInstance, request: DataRequest): Promise<any> {
    const payload = {
      symbols: request.symbols,
      fields: request.fields,
      startDate: request.startDate,
      endDate: request.endDate,
      frequency: request.frequency || 'daily',
    };

    const response = await connector.post('/market-data', payload);
    return response.data;
  }

  private async fetchBloombergCompanyData(connector: AxiosInstance, symbols: string[]): Promise<any> {
    const payload = {
      symbols,
      fields: ['NAME', 'SECTOR', 'INDUSTRY', 'MARKET_CAP', 'EMPLOYEES', 'HEADQUARTERS'],
    };

    const response = await connector.post('/company-data', payload);
    return response.data;
  }

  private async fetchBloombergFinancials(connector: AxiosInstance, symbols: string[], period: string): Promise<any> {
    const payload = {
      symbols,
      period,
      statements: ['INCOME_STATEMENT', 'BALANCE_SHEET', 'CASH_FLOW'],
    };

    const response = await connector.post('/financial-statements', payload);
    return response.data;
  }

  private async fetchBloombergEstimates(connector: AxiosInstance, symbols: string[]): Promise<any> {
    const payload = {
      symbols,
      estimates: ['EPS', 'REVENUE', 'EBITDA'],
      periods: ['CURRENT_YEAR', 'NEXT_YEAR'],
    };

    const response = await connector.post('/analyst-estimates', payload);
    return response.data;
  }

  // FactSet API methods
  private async fetchFactSetData(connector: AxiosInstance, request: DataRequest): Promise<any> {
    const payload = {
      identifiers: request.symbols,
      fields: request.fields,
      startDate: request.startDate,
      endDate: request.endDate,
      frequency: request.frequency || 'D',
    };

    const response = await connector.post('/timeseries', payload);
    return response.data;
  }

  private async fetchFactSetCompanyData(connector: AxiosInstance, symbols: string[]): Promise<any> {
    const payload = {
      identifiers: symbols,
      fields: ['NAME', 'SECTOR', 'INDUSTRY', 'MARKET_CAP', 'EMPLOYEES', 'HEADQUARTERS'],
    };

    const response = await connector.post('/company', payload);
    return response.data;
  }

  private async fetchFactSetFinancials(connector: AxiosInstance, symbols: string[], period: string): Promise<any> {
    const payload = {
      identifiers: symbols,
      period: period.toUpperCase(),
      statements: ['INCOME', 'BALANCE', 'CASH_FLOW'],
    };

    const response = await connector.post('/financial-statements', payload);
    return response.data;
  }

  private async fetchFactSetEstimates(connector: AxiosInstance, symbols: string[]): Promise<any> {
    const payload = {
      identifiers: symbols,
      estimates: ['EPS', 'REVENUE', 'EBITDA'],
      periods: ['FY0', 'FY1'],
    };

    const response = await connector.post('/estimates', payload);
    return response.data;
  }

  // Capital IQ API methods
  private async fetchCapitalIQData(connector: AxiosInstance, request: DataRequest): Promise<any> {
    const payload = {
      symbols: request.symbols,
      fields: request.fields,
      startDate: request.startDate,
      endDate: request.endDate,
      frequency: request.frequency || 'daily',
    };

    const response = await connector.post('/market-data', payload);
    return response.data;
  }

  private async fetchCapitalIQCompanyData(connector: AxiosInstance, symbols: string[]): Promise<any> {
    const payload = {
      symbols,
      fields: ['COMPANY_NAME', 'SECTOR', 'INDUSTRY', 'MARKET_CAP', 'EMPLOYEES', 'HEADQUARTERS'],
    };

    const response = await connector.post('/company-profile', payload);
    return response.data;
  }

  private async fetchCapitalIQFinancials(connector: AxiosInstance, symbols: string[], period: string): Promise<any> {
    const payload = {
      symbols,
      period: period.toUpperCase(),
      statements: ['INCOME_STATEMENT', 'BALANCE_SHEET', 'CASH_FLOW_STATEMENT'],
    };

    const response = await connector.post('/financial-data', payload);
    return response.data;
  }

  private async fetchCapitalIQEstimates(connector: AxiosInstance, symbols: string[]): Promise<any> {
    const payload = {
      symbols,
      estimates: ['EPS', 'REVENUE', 'EBITDA'],
      periods: ['CURRENT_YEAR', 'NEXT_YEAR'],
    };

    const response = await connector.post('/consensus-estimates', payload);
    return response.data;
  }

  // Refinitiv API methods
  private async fetchRefinitivData(connector: AxiosInstance, request: DataRequest): Promise<any> {
    const payload = {
      symbols: request.symbols,
      fields: request.fields,
      startDate: request.startDate,
      endDate: request.endDate,
      frequency: request.frequency || 'daily',
    };

    const response = await connector.post('/market-data', payload);
    return response.data;
  }

  private async fetchRefinitivCompanyData(connector: AxiosInstance, symbols: string[]): Promise<any> {
    const payload = {
      symbols,
      fields: ['COMPANY_NAME', 'SECTOR', 'INDUSTRY', 'MARKET_CAP', 'EMPLOYEES', 'HEADQUARTERS'],
    };

    const response = await connector.post('/company-data', payload);
    return response.data;
  }

  private async fetchRefinitivFinancials(connector: AxiosInstance, symbols: string[], period: string): Promise<any> {
    const payload = {
      symbols,
      period: period.toUpperCase(),
      statements: ['INCOME_STATEMENT', 'BALANCE_SHEET', 'CASH_FLOW_STATEMENT'],
    };

    const response = await connector.post('/financial-statements', payload);
    return response.data;
  }

  private async fetchRefinitivEstimates(connector: AxiosInstance, symbols: string[]): Promise<any> {
    const payload = {
      symbols,
      estimates: ['EPS', 'REVENUE', 'EBITDA'],
      periods: ['CURRENT_YEAR', 'NEXT_YEAR'],
    };

    const response = await connector.post('/analyst-estimates', payload);
    return response.data;
  }

  // Data parsing methods
  private parseMarketData(response: any, connectorType: string): MarketData[] {
    // This would parse the actual response format from each provider
    // For now, return mock data
    return response.data?.map((item: any) => ({
      symbol: item.symbol || item.identifier,
      date: item.date,
      open: parseFloat(item.open || 0),
      high: parseFloat(item.high || 0),
      low: parseFloat(item.low || 0),
      close: parseFloat(item.close || 0),
      volume: parseInt(item.volume || 0),
      adjustedClose: parseFloat(item.adjustedClose || item.close || 0),
    })) || [];
  }

  private parseCompanyData(response: any, connectorType: string): CompanyData[] {
    return response.data?.map((item: any) => ({
      symbol: item.symbol || item.identifier,
      name: item.name || item.companyName,
      sector: item.sector || '',
      industry: item.industry || '',
      marketCap: parseFloat(item.marketCap || 0),
      employees: parseInt(item.employees || 0),
      headquarters: item.headquarters || '',
    })) || [];
  }

  private parseFinancialStatements(response: any, connectorType: string): FinancialData[] {
    const financialData: FinancialData[] = [];

    if (response.data?.incomeStatements) {
      response.data.incomeStatements.forEach((statement: any) => {
        financialData.push({
          id: `income_${statement.symbol}_${statement.period}`,
          type: 'income_statement',
          period: statement.period,
          values: statement.data,
          metadata: {
            currency: statement.currency || 'USD',
            units: statement.units || 'millions',
            source: {
              source: 'api',
              apiEndpoint: connectorType,
              extractionMethod: 'api_call',
              timestamp: new Date().toISOString(),
            },
          },
        });
      });
    }

    if (response.data?.balanceSheets) {
      response.data.balanceSheets.forEach((statement: any) => {
        financialData.push({
          id: `balance_${statement.symbol}_${statement.period}`,
          type: 'balance_sheet',
          period: statement.period,
          values: statement.data,
          metadata: {
            currency: statement.currency || 'USD',
            units: statement.units || 'millions',
            source: {
              source: 'api',
              apiEndpoint: connectorType,
              extractionMethod: 'api_call',
              timestamp: new Date().toISOString(),
            },
          },
        });
      });
    }

    if (response.data?.cashFlowStatements) {
      response.data.cashFlowStatements.forEach((statement: any) => {
        financialData.push({
          id: `cashflow_${statement.symbol}_${statement.period}`,
          type: 'cash_flow',
          period: statement.period,
          values: statement.data,
          metadata: {
            currency: statement.currency || 'USD',
            units: statement.units || 'millions',
            source: {
              source: 'api',
              apiEndpoint: connectorType,
              extractionMethod: 'api_call',
              timestamp: new Date().toISOString(),
            },
          },
        });
      });
    }

    return financialData;
  }

  private parseAnalystEstimates(response: any, connectorType: string): any[] {
    return response.data?.map((estimate: any) => ({
      symbol: estimate.symbol || estimate.identifier,
      period: estimate.period,
      estimates: {
        eps: estimate.eps || {},
        revenue: estimate.revenue || {},
        ebitda: estimate.ebitda || {},
      },
      consensus: estimate.consensus || {},
      high: estimate.high || {},
      low: estimate.low || {},
      source: connectorType,
    })) || [];
  }

  async testConnection(connectorType: string): Promise<boolean> {
    try {
      const connector = this.connectors.get(connectorType);
      if (!connector) {
        return false;
      }

      // Test with a simple request
      const response = await connector.get('/health');
      return response.status === 200;
    } catch (error) {
      logger.error(`Connection test failed for ${connectorType}:`, error);
      return false;
    }
  }

  getAvailableConnectors(): string[] {
    return Array.from(this.connectors.keys());
  }

  async syncData(connectorType: string, symbols: string[], dataTypes: string[]): Promise<any> {
    try {
      logger.info(`Syncing data from ${connectorType}`, { symbols, dataTypes });

      const results: any = {};

      for (const dataType of dataTypes) {
        switch (dataType) {
          case 'market_data':
            results.marketData = await this.getMarketData(connectorType, {
              symbols,
              fields: ['OPEN', 'HIGH', 'LOW', 'CLOSE', 'VOLUME'],
              frequency: 'daily',
            });
            break;
          case 'company_data':
            results.companyData = await this.getCompanyData(connectorType, symbols);
            break;
          case 'financial_statements':
            results.financialStatements = await this.getFinancialStatements(connectorType, symbols);
            break;
          case 'analyst_estimates':
            results.analystEstimates = await this.getAnalystEstimates(connectorType, symbols);
            break;
        }
      }

      return results;
    } catch (error) {
      logger.error(`Data sync failed for ${connectorType}:`, error);
      throw error;
    }
  }
}

import { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import { DataConnectorService } from '../services/dataConnectorService';
import { APIResponse, DataConnector } from '@shared/types';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class ConnectorController {
  private db = getDatabase();
  private dataConnectorService = new DataConnectorService();

  async getConnectors(req: Request, res: Response) {
    try {
      const connectors = await this.db.dataConnector.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const response: DataConnector[] = connectors.map(connector => ({
        id: connector.id,
        name: connector.name,
        type: connector.type as any,
        config: connector.config as any,
        status: connector.status.toLowerCase() as any,
        lastSync: connector.lastSync?.toISOString(),
      }));

      res.json({
        success: true,
        data: response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error getting connectors:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve connectors',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async connect(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const { config } = req.body;

      if (!config || !config.apiKey) {
        return res.status(400).json({
          success: false,
          error: 'API key is required',
          timestamp: new Date().toISOString(),
        });
      }

      // Test connection
      const isConnected = await this.dataConnectorService.testConnection(type);
      
      if (!isConnected) {
        return res.status(400).json({
          success: false,
          error: 'Failed to connect to data provider',
          timestamp: new Date().toISOString(),
        });
      }

      // Save or update connector configuration
      const existingConnector = await this.db.dataConnector.findFirst({
        where: { type: type.toUpperCase() as any },
      });

      let connector;
      if (existingConnector) {
        connector = await this.db.dataConnector.update({
          where: { id: existingConnector.id },
          data: {
            config,
            status: 'CONNECTED',
            lastSync: new Date(),
          },
        });
      } else {
        connector = await this.db.dataConnector.create({
          data: {
            id: uuidv4(),
            name: this.getConnectorName(type),
            type: type.toUpperCase() as any,
            config,
            status: 'CONNECTED',
            lastSync: new Date(),
          },
        });
      }

      res.json({
        success: true,
        data: {
          id: connector.id,
          name: connector.name,
          type: connector.type,
          status: connector.status.toLowerCase(),
          connectedAt: connector.lastSync?.toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error connecting to data provider:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to connect to data provider',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async disconnect(req: Request, res: Response) {
    try {
      const { type } = req.params;

      const connector = await this.db.dataConnector.findFirst({
        where: { type: type.toUpperCase() as any },
      });

      if (!connector) {
        return res.status(404).json({
          success: false,
          error: 'Connector not found',
          timestamp: new Date().toISOString(),
        });
      }

      await this.db.dataConnector.update({
        where: { id: connector.id },
        data: { status: 'DISCONNECTED' },
      });

      res.json({
        success: true,
        message: 'Connector disconnected successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error disconnecting from data provider:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to disconnect from data provider',
        timestamp: new Date().toISOString(),
      });
    }
  }

  async sync(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const { symbols, dataTypes } = req.body;

      if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Symbols array is required',
          timestamp: new Date().toISOString(),
        });
      }

      const requestedDataTypes = dataTypes || ['market_data', 'company_data', 'financial_statements'];

      // Check if connector is available
      const availableConnectors = this.dataConnectorService.getAvailableConnectors();
      if (!availableConnectors.includes(type)) {
        return res.status(400).json({
          success: false,
          error: `Connector ${type} is not available`,
          timestamp: new Date().toISOString(),
        });
      }

      // Update connector status
      const connector = await this.db.dataConnector.findFirst({
        where: { type: type.toUpperCase() as any },
      });

      if (!connector || connector.status !== 'CONNECTED') {
        return res.status(400).json({
          success: false,
          error: 'Connector is not connected',
          timestamp: new Date().toISOString(),
        });
      }

      // Perform data sync
      const syncResults = await this.dataConnectorService.syncData(type, symbols, requestedDataTypes);

      // Update last sync time
      await this.db.dataConnector.update({
        where: { id: connector.id },
        data: { lastSync: new Date() },
      });

      res.json({
        success: true,
        data: {
          connector: type,
          symbols,
          dataTypes: requestedDataTypes,
          results: syncResults,
          syncedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error syncing data:', error);
      res.status(500).json({
        success: false,
        error: 'Data sync failed',
        timestamp: new Date().toISOString(),
      });
    }
  }

  private getConnectorName(type: string): string {
    const names: Record<string, string> = {
      bloomberg: 'Bloomberg Terminal',
      factset: 'FactSet',
      capiq: 'Capital IQ',
      refinitiv: 'Refinitiv (LSEG)',
      pitchbook: 'PitchBook',
    };
    return names[type.toLowerCase()] || type;
  }
}

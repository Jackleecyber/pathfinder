import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { config } from '../config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cascade API',
      version: '1.0.0',
      description: 'AI-powered Excel add-in for finance professionals',
      contact: {
        name: 'Cascade Team',
        email: 'support@cascade.ai',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: config.apiBaseUrl,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        CascadeAction: {
          type: 'object',
          required: ['type', 'payload', 'confidence'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique action identifier',
            },
            type: {
              type: 'string',
              enum: ['insert_values', 'generate_formula', 'create_chart', 'build_pivot', 'ask_clarification', 'extract_data', 'analyze_financials'],
              description: 'Type of action to perform',
            },
            payload: {
              type: 'object',
              description: 'Action-specific payload data',
            },
            confidence: {
              type: 'number',
              minimum: 0,
              maximum: 1,
              description: 'Confidence score for the action',
            },
            preview: {
              type: 'object',
              description: 'Preview data for the action',
            },
            provenance: {
              type: 'object',
              description: 'Source information for the action',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Action creation timestamp',
            },
          },
        },
        ChatMessage: {
          type: 'object',
          required: ['role', 'content'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique message identifier',
            },
            role: {
              type: 'string',
              enum: ['user', 'assistant', 'system'],
              description: 'Message role',
            },
            content: {
              type: 'string',
              description: 'Message content',
            },
            actions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CascadeAction',
              },
              description: 'Actions associated with the message',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Message creation timestamp',
            },
            context: {
              type: 'object',
              description: 'Additional context for the message',
            },
          },
        },
        FileUpload: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique file identifier',
            },
            name: {
              type: 'string',
              description: 'Original file name',
            },
            type: {
              type: 'string',
              description: 'File MIME type',
            },
            size: {
              type: 'integer',
              description: 'File size in bytes',
            },
            status: {
              type: 'string',
              enum: ['uploading', 'processing', 'completed', 'error'],
              description: 'Upload status',
            },
            extractedData: {
              type: 'array',
              description: 'Extracted data from the file',
            },
            error: {
              type: 'string',
              description: 'Error message if upload failed',
            },
            uploadedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Upload timestamp',
            },
          },
        },
        WebScrapeResult: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique scrape identifier',
            },
            url: {
              type: 'string',
              description: 'Scraped URL',
            },
            title: {
              type: 'string',
              description: 'Page title',
            },
            extractedData: {
              type: 'object',
              properties: {
                tables: {
                  type: 'array',
                  description: 'Extracted tables',
                },
                text: {
                  type: 'string',
                  description: 'Extracted text',
                },
                metadata: {
                  type: 'object',
                  description: 'Additional metadata',
                },
              },
            },
            status: {
              type: 'string',
              enum: ['success', 'error'],
              description: 'Scrape status',
            },
            error: {
              type: 'string',
              description: 'Error message if scrape failed',
            },
            scrapedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Scrape timestamp',
            },
          },
        },
        FinancialData: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique data identifier',
            },
            type: {
              type: 'string',
              enum: ['income_statement', 'balance_sheet', 'cash_flow', 'transaction_data', 'market_data'],
              description: 'Type of financial data',
            },
            period: {
              type: 'string',
              description: 'Time period for the data',
            },
            values: {
              type: 'object',
              description: 'Financial values',
            },
            metadata: {
              type: 'object',
              properties: {
                currency: {
                  type: 'string',
                  description: 'Currency code',
                },
                units: {
                  type: 'string',
                  description: 'Units of measurement',
                },
                source: {
                  type: 'object',
                  description: 'Data source information',
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API files
};

const specs = swaggerJsdoc(options);

export function swaggerSetup(app: Express): void {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Cascade API Documentation',
  }));

  // Swagger JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
}

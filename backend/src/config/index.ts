import dotenv from 'dotenv';
import { AppConfig } from '@shared/types';

// Load environment variables
dotenv.config();

export const config: AppConfig = {
  // Server configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API configuration
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
  wsUrl: process.env.WS_URL || 'ws://localhost:3000',
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
    credentials: true,
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/cascade',
    ssl: process.env.NODE_ENV === 'production',
  },
  
  // Redis configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
  },
  
  // Vector database configuration
  vectorDB: {
    pinecone: {
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    },
    milvus: {
      host: process.env.MILVUS_HOST || 'localhost',
      port: parseInt(process.env.MILVUS_PORT || '19530', 10),
    },
  },
  
  // AI/ML configuration
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4',
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000', 10),
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.1'),
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
      maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '4000', 10),
    },
    embedding: {
      model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
      dimensions: parseInt(process.env.EMBEDDING_DIMENSIONS || '1536', 10),
    },
  },
  
  // File storage configuration
  fileStorage: {
    provider: process.env.FILE_STORAGE_PROVIDER || 'local',
    local: {
      uploadPath: process.env.LOCAL_UPLOAD_PATH || './uploads',
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10), // 50MB
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.S3_BUCKET || 'cascade-files',
    },
  },
  
  // External data providers
  dataProviders: {
    bloomberg: {
      apiKey: process.env.BLOOMBERG_API_KEY,
      endpoint: process.env.BLOOMBERG_ENDPOINT,
    },
    factset: {
      apiKey: process.env.FACTSET_API_KEY,
      endpoint: process.env.FACTSET_ENDPOINT,
    },
    capiq: {
      apiKey: process.env.CAPIQ_API_KEY,
      endpoint: process.env.CAPIQ_ENDPOINT,
    },
    refinitiv: {
      apiKey: process.env.REFINITIV_API_KEY,
      endpoint: process.env.REFINITIV_ENDPOINT,
    },
    pitchbook: {
      apiKey: process.env.PITCHBOOK_API_KEY,
      endpoint: process.env.PITCHBOOK_ENDPOINT,
    },
  },
  
  // Security configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  },
  
  // Web scraping configuration
  webScraping: {
    playwright: {
      browserPath: process.env.PLAYWRIGHT_BROWSER_PATH,
      userAgent: process.env.USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timeout: parseInt(process.env.SCRAPING_TIMEOUT || '30000', 10),
    },
    puppeteer: {
      headless: process.env.PUPPETEER_HEADLESS !== 'false',
      timeout: parseInt(process.env.PUPPETEER_TIMEOUT || '30000', 10),
    },
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/cascade.log',
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: parseInt(process.env.LOG_MAX_FILES || '5', 10),
  },
  
  // Feature flags
  features: {
    webScraping: process.env.FEATURE_WEB_SCRAPING !== 'false',
    fileProcessing: process.env.FEATURE_FILE_PROCESSING !== 'false',
    aiAnalysis: process.env.FEATURE_AI_ANALYSIS !== 'false',
    dataConnectors: process.env.FEATURE_DATA_CONNECTORS !== 'false',
  },
  
  // File upload limits
  fileUploadLimit: parseInt(process.env.FILE_UPLOAD_LIMIT || '52428800', 10), // 50MB
  
  // Supported file types
  supportedFileTypes: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/bmp',
    'image/tiff',
  ],
  
  // AI models configuration
  aiModels: {
    primary: process.env.AI_MODEL_PRIMARY || 'gpt-4',
    fallback: process.env.AI_MODEL_FALLBACK || 'gpt-3.5-turbo',
    embedding: process.env.AI_MODEL_EMBEDDING || 'text-embedding-3-small',
  },
};

// Validate required environment variables
export function validateConfig(): void {
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // Validate AI API keys
  if (!config.ai.openai.apiKey && !config.ai.anthropic.apiKey) {
    console.warn('⚠️  No AI API keys configured. AI features will be disabled.');
  }
  
  // Validate file storage
  if (config.fileStorage.provider === 'aws' && !config.fileStorage.aws.accessKeyId) {
    throw new Error('AWS credentials required when using AWS file storage');
  }
}

// Export individual config sections for convenience
export const {
  database,
  redis,
  vectorDB,
  ai,
  fileStorage,
  dataProviders,
  security,
  webScraping,
  logging,
  features,
} = config;

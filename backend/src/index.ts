import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { authMiddleware } from './middleware/auth';
import { apiRoutes } from './routes';
import { initializeDatabase } from './database/connection';
import { initializeRedis } from './services/redis';
import { initializeVectorDB } from './services/vectorDB';
import { initializeFileStorage } from './services/fileStorage';
import { initializeQueue } from './services/queue';
import { logger } from './utils/logger';
import { swaggerSetup } from './utils/swagger';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Compression
app.use(compression());

// Logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

// Request parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Cascade API is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API documentation
swaggerSetup(app);

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Error handling
app.use(errorHandler);

// Initialize services
async function initializeServices() {
  try {
    logger.info('Initializing Cascade services...');
    
    // Initialize database
    await initializeDatabase();
    logger.info('✅ Database connected');
    
    // Initialize Redis
    await initializeRedis();
    logger.info('✅ Redis connected');
    
    // Initialize Vector Database
    await initializeVectorDB();
    logger.info('✅ Vector database connected');
    
    // Initialize file storage
    await initializeFileStorage();
    logger.info('✅ File storage initialized');
    
    // Initialize job queue
    await initializeQueue();
    logger.info('✅ Job queue initialized');
    
    logger.info('🚀 All services initialized successfully');
  } catch (error) {
    logger.error('❌ Failed to initialize services:', error);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    await initializeServices();
    
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Cascade API server running on port ${config.port}`);
      logger.info(`📚 API documentation available at http://localhost:${config.port}/api-docs`);
      logger.info(`🏥 Health check available at http://localhost:${config.port}/health`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

export default app;

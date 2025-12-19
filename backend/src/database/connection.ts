import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { logger } from '../utils/logger';

let prisma: PrismaClient;

export async function initializeDatabase(): Promise<void> {
  try {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.database.url,
        },
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    // Log database queries in development
    if (config.nodeEnv === 'development') {
      prisma.$on('query', (e) => {
        logger.debug('Database Query:', {
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
        });
      });
    }

    // Log database errors
    prisma.$on('error', (e) => {
      logger.error('Database Error:', e);
    });

    // Test the connection
    await prisma.$connect();
    
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
}

export function getDatabase(): PrismaClient {
  if (!prisma) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return prisma;
}

export async function closeDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Database connection closed');
  }
}

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
}

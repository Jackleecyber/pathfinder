import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

let redis: Redis | null = null;

export async function initializeRedis(): Promise<void> {
  try {
    redis = new Redis(config.redis.url, {
      password: config.redis.password,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    });

    redis.on('connect', () => {
      logger.info('Redis connected');
    });

    redis.on('error', (error) => {
      logger.error('Redis error:', error);
    });

    // Test connection
    await redis.ping();
    logger.info('Redis connection established');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
}

export function getRedis(): Redis {
  if (!redis) {
    throw new Error('Redis not initialized. Call initializeRedis() first.');
  }
  return redis;
}

export async function checkRedisHealth(): Promise<boolean> {
  try {
    if (!redis) return false;
    await redis.ping();
    return true;
  } catch (error) {
    logger.error('Redis health check failed:', error);
    return false;
  }
}

export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    logger.info('Redis connection closed');
  }
}

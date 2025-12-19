import { Router } from 'express';
import { checkDatabaseHealth } from '../database/connection';
import { checkRedisHealth } from '../services/redis';
import { checkVectorDBHealth } from '../services/vectorDB';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                 services:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: boolean
 *                     redis:
 *                       type: boolean
 *                     vectorDB:
 *                       type: boolean
 *       503:
 *         description: Service is unhealthy
 */
router.get('/', async (req, res) => {
  try {
    const healthChecks = await Promise.allSettled([
      checkDatabaseHealth(),
      checkRedisHealth(),
      checkVectorDBHealth(),
    ]);

    const [database, redis, vectorDB] = healthChecks.map(
      (result) => result.status === 'fulfilled' && result.value
    );

    const isHealthy = database && redis && vectorDB;

    const statusCode = isHealthy ? 200 : 503;
    const message = isHealthy ? 'All services are healthy' : 'Some services are unhealthy';

    res.status(statusCode).json({
      success: isHealthy,
      message,
      timestamp: new Date().toISOString(),
      services: {
        database: !!database,
        redis: !!redis,
        vectorDB: !!vectorDB,
      },
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @swagger
 * /api/health/ready:
 *   get:
 *     summary: Readiness check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *       503:
 *         description: Service is not ready
 */
router.get('/ready', async (req, res) => {
  try {
    // Check if all critical services are ready
    const isReady = await checkDatabaseHealth();
    
    if (isReady) {
      res.status(200).json({
        success: true,
        message: 'Service is ready',
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        success: false,
        message: 'Service is not ready',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    logger.error('Readiness check failed:', error);
    res.status(503).json({
      success: false,
      message: 'Readiness check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * @swagger
 * /api/health/live:
 *   get:
 *     summary: Liveness check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 */
router.get('/live', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Service is alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export { router as healthRoutes };

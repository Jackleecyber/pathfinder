import { Router } from 'express';
import { authRoutes } from './auth';
import { chatRoutes } from './chat';
import { fileRoutes } from './files';
import { scrapingRoutes } from './scraping';
import { analysisRoutes } from './analysis';
import { connectorRoutes } from './connectors';
import { preferenceRoutes } from './preferences';
import { auditRoutes } from './audit';
import { healthRoutes } from './health';
import { mentorshipRoutes } from './mentorship';
import { cvRoutes } from './cv';
import { interviewRoutes } from './interviews';

const router = Router();

// Health check (no auth required)
router.use('/health', healthRoutes);

// Authentication routes (no auth required)
router.use('/auth', authRoutes);

// Protected routes (require authentication)
router.use('/chat', chatRoutes);
router.use('/files', fileRoutes);
router.use('/scraping', scrapingRoutes);
router.use('/analysis', analysisRoutes);
router.use('/connectors', connectorRoutes);
router.use('/preferences', preferenceRoutes);
router.use('/audit', auditRoutes);

// Mentorship platform routes
router.use('/mentorship', mentorshipRoutes);
router.use('/cv', cvRoutes);
router.use('/interviews', interviewRoutes);

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    message: 'Cascade API Documentation',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        logout: 'POST /api/auth/logout',
        refresh: 'POST /api/auth/refresh',
      },
      chat: {
        messages: 'GET /api/chat/messages',
        send: 'POST /api/chat/send',
        execute: 'POST /api/chat/execute',
      },
      files: {
        upload: 'POST /api/files/upload',
        list: 'GET /api/files/uploads',
        process: 'POST /api/files/:id/process',
        delete: 'DELETE /api/files/:id',
      },
      scraping: {
        scrape: 'POST /api/scraping/scrape',
        results: 'GET /api/scraping/results',
        delete: 'DELETE /api/scraping/:id',
      },
      analysis: {
        financials: 'POST /api/analysis/financials',
        model: 'POST /api/analysis/model',
        metrics: 'POST /api/analysis/metrics',
      },
      connectors: {
        list: 'GET /api/connectors',
        connect: 'POST /api/connectors/:type/connect',
        disconnect: 'POST /api/connectors/:type/disconnect',
        sync: 'POST /api/connectors/:type/sync',
      },
      preferences: {
        get: 'GET /api/preferences',
        update: 'PUT /api/preferences',
      },
      audit: {
        logs: 'GET /api/audit/logs',
      },
    },
  });
});

export { router as apiRoutes };

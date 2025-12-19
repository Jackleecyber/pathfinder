import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { AuditController } from '../controllers/auditController';

const router = Router();
router.use(authMiddleware);

const auditController = new AuditController();

// Audit log routes
router.get('/logs', adminMiddleware, auditController.getLogs);

export { router as auditRoutes };

import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { AnalysisController } from '../controllers/analysisController';

const router = Router();
router.use(authMiddleware);

const analysisController = new AnalysisController();

// Financial analysis routes
router.post('/financials', analysisController.analyzeFinancials);
router.post('/model', analysisController.generateModel);
router.post('/metrics', analysisController.calculateMetrics);

export { router as analysisRoutes };

import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { PreferenceController } from '../controllers/preferenceController';

const router = Router();
router.use(authMiddleware);

const preferenceController = new PreferenceController();

// User preferences routes
router.get('/', preferenceController.getPreferences);
router.put('/', preferenceController.updatePreferences);

export { router as preferenceRoutes };

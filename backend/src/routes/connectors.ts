import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { ConnectorController } from '../controllers/connectorController';

const router = Router();
router.use(authMiddleware);

const connectorController = new ConnectorController();

// Data connector routes
router.get('/', connectorController.getConnectors);
router.post('/:type/connect', connectorController.connect);
router.post('/:type/disconnect', connectorController.disconnect);
router.post('/:type/sync', connectorController.sync);

export { router as connectorRoutes };

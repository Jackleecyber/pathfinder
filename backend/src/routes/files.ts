import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { FileController } from '../controllers/fileController';

const router = Router();
router.use(authMiddleware);

const fileController = new FileController();

// File upload routes
router.post('/upload', fileController.upload);
router.get('/uploads', fileController.getUploads);
router.post('/:id/process', fileController.process);
router.delete('/:id', fileController.delete);

export { router as fileRoutes };

import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { cvController } from '../controllers/cvController';
import { logger } from '../utils/logger';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * CV Management Routes
 */
router.post('/', async (req, res, next) => {
  try {
    const result = await cvController.createCV(req);
    res.status(201).json(result);
  } catch (error) {
    logger.error('Error creating CV:', error);
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await cvController.getStudentCVs(req);
    res.json(result);
  } catch (error) {
    logger.error('Error getting CVs:', error);
    next(error);
  }
});

router.get('/:cvId', async (req, res, next) => {
  try {
    const result = await cvController.getCV(req);
    res.json(result);
  } catch (error) {
    logger.error('Error getting CV:', error);
    next(error);
  }
});

router.put('/:cvId', async (req, res, next) => {
  try {
    const result = await cvController.updateCV(req);
    res.json(result);
  } catch (error) {
    logger.error('Error updating CV:', error);
    next(error);
  }
});

router.delete('/:cvId', async (req, res, next) => {
  try {
    const result = await cvController.deleteCV(req);
    res.json(result);
  } catch (error) {
    logger.error('Error deleting CV:', error);
    next(error);
  }
});

router.post('/:cvId/primary', async (req, res, next) => {
  try {
    const result = await cvController.setPrimaryCV(req);
    res.json(result);
  } catch (error) {
    logger.error('Error setting primary CV:', error);
    next(error);
  }
});

/**
 * CV Review Routes
 */
router.post('/:cvId/review/ai', async (req, res, next) => {
  try {
    const result = await cvController.getAIReview(req);
    res.json(result);
  } catch (error) {
    logger.error('Error getting AI review:', error);
    next(error);
  }
});

router.post('/:cvId/review/mentor', async (req, res, next) => {
  try {
    const result = await cvController.addMentorFeedback(req);
    res.json(result);
  } catch (error) {
    logger.error('Error adding mentor feedback:', error);
    next(error);
  }
});

router.post('/:cvId/approve', async (req, res, next) => {
  try {
    const result = await cvController.approveCV(req);
    res.json(result);
  } catch (error) {
    logger.error('Error approving CV:', error);
    next(error);
  }
});

export { router as cvRoutes };


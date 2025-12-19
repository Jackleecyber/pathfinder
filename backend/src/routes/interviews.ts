import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { interviewController } from '../controllers/interviewController';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Interview Questions Routes (public for browsing, auth for creating)
 */
router.get('/questions', async (req, res, next) => {
  try {
    const result = await interviewController.getQuestions(req);
    res.json(result);
  } catch (error) {
    logger.error('Error getting questions:', error);
    next(error);
  }
});

router.get('/questions/practice', async (req, res, next) => {
  try {
    const result = await interviewController.getPracticeSet(req);
    res.json(result);
  } catch (error) {
    logger.error('Error getting practice set:', error);
    next(error);
  }
});

router.get('/questions/search', async (req, res, next) => {
  try {
    const result = await interviewController.searchQuestions(req);
    res.json(result);
  } catch (error) {
    logger.error('Error searching questions:', error);
    next(error);
  }
});

// Protected routes require authentication
router.use(authMiddleware);

router.post('/questions', async (req, res, next) => {
  try {
    const result = await interviewController.createQuestion(req);
    res.status(201).json(result);
  } catch (error) {
    logger.error('Error creating question:', error);
    next(error);
  }
});

router.get('/questions/recommended', async (req, res, next) => {
  try {
    const result = await interviewController.getRecommendedQuestions(req);
    res.json(result);
  } catch (error) {
    logger.error('Error getting recommended questions:', error);
    next(error);
  }
});

/**
 * Mock Interview Routes
 */
router.post('/mock', async (req, res, next) => {
  try {
    const result = await interviewController.scheduleMockInterview(req);
    res.status(201).json(result);
  } catch (error) {
    logger.error('Error scheduling mock interview:', error);
    next(error);
  }
});

router.get('/mock', async (req, res, next) => {
  try {
    const result = await interviewController.getStudentInterviews(req);
    res.json(result);
  } catch (error) {
    logger.error('Error getting mock interviews:', error);
    next(error);
  }
});

router.get('/mock/:interviewId', async (req, res, next) => {
  try {
    const result = await interviewController.getMockInterview(req);
    res.json(result);
  } catch (error) {
    logger.error('Error getting mock interview:', error);
    next(error);
  }
});

router.post('/mock/:interviewId/start', async (req, res, next) => {
  try {
    const result = await interviewController.startMockInterview(req);
    res.json(result);
  } catch (error) {
    logger.error('Error starting mock interview:', error);
    next(error);
  }
});

router.post('/mock/:interviewId/answer', async (req, res, next) => {
  try {
    const result = await interviewController.submitAnswer(req);
    res.json(result);
  } catch (error) {
    logger.error('Error submitting answer:', error);
    next(error);
  }
});

router.post('/mock/:interviewId/complete', async (req, res, next) => {
  try {
    const result = await interviewController.completeMockInterview(req);
    res.json(result);
  } catch (error) {
    logger.error('Error completing mock interview:', error);
    next(error);
  }
});

router.post('/mock/:interviewId/cancel', async (req, res, next) => {
  try {
    const result = await interviewController.cancelMockInterview(req);
    res.json(result);
  } catch (error) {
    logger.error('Error cancelling mock interview:', error);
    next(error);
  }
});

export { router as interviewRoutes };


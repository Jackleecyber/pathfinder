import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { mentorshipController } from '../controllers/mentorshipController';
import { logger } from '../utils/logger';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * Student Profile Routes
 */
router.post('/student/profile', async (req, res, next) => {
  try {
    const result = await mentorshipController.createOrUpdateStudentProfile(req);
    res.json(result);
  } catch (error) {
    logger.error('Error in create/update student profile:', error);
    next(error);
  }
});

router.get('/student/profile', async (req, res, next) => {
  try {
    const result = await mentorshipController.getStudentProfile(req);
    res.json(result);
  } catch (error) {
    logger.error('Error getting student profile:', error);
    next(error);
  }
});

/**
 * Mentor Profile Routes
 */
router.post('/mentor/profile', async (req, res, next) => {
  try {
    const result = await mentorshipController.createOrUpdateMentorProfile(req);
    res.json(result);
  } catch (error) {
    logger.error('Error in create/update mentor profile:', error);
    next(error);
  }
});

router.get('/mentor/profile', async (req, res, next) => {
  try {
    const result = await mentorshipController.getMentorProfile(req);
    res.json(result);
  } catch (error) {
    logger.error('Error getting mentor profile:', error);
    next(error);
  }
});

/**
 * Mentor Matching
 */
router.get('/mentors/match', async (req, res, next) => {
  try {
    const result = await mentorshipController.findMatchingMentors(req);
    res.json(result);
  } catch (error) {
    logger.error('Error finding matching mentors:', error);
    next(error);
  }
});

/**
 * Mentorship Sessions
 */
router.post('/sessions', async (req, res, next) => {
  try {
    const result = await mentorshipController.scheduleSession(req);
    res.status(201).json(result);
  } catch (error) {
    logger.error('Error scheduling session:', error);
    next(error);
  }
});

router.get('/sessions/student', async (req, res, next) => {
  try {
    const result = await mentorshipController.getStudentSessions(req);
    res.json(result);
  } catch (error) {
    logger.error('Error getting student sessions:', error);
    next(error);
  }
});

router.get('/sessions/mentor', async (req, res, next) => {
  try {
    const result = await mentorshipController.getMentorSessions(req);
    res.json(result);
  } catch (error) {
    logger.error('Error getting mentor sessions:', error);
    next(error);
  }
});

router.patch('/sessions/:sessionId/status', async (req, res, next) => {
  try {
    const result = await mentorshipController.updateSessionStatus(req);
    res.json(result);
  } catch (error) {
    logger.error('Error updating session status:', error);
    next(error);
  }
});

router.post('/sessions/:sessionId/feedback', async (req, res, next) => {
  try {
    const result = await mentorshipController.addSessionFeedback(req);
    res.json(result);
  } catch (error) {
    logger.error('Error adding session feedback:', error);
    next(error);
  }
});

export { router as mentorshipRoutes };


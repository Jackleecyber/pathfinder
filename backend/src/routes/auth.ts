import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { AuthController } from '../controllers/authController';
import { logger } from '../utils/logger';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await authController.login(req.body);
      res.json(result);
    } catch (error) {
      logger.error('Login error:', error);
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *                 minLength: 2
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await authController.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      logger.error('Registration error:', error);
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', async (req, res, next) => {
  try {
    const result = await authController.logout(req);
    res.json(result);
  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await authController.refreshToken(req.body.refreshToken);
      res.json(result);
    } catch (error) {
      logger.error('Token refresh error:', error);
      next(error);
    }
  }
);

export { router as authRoutes };

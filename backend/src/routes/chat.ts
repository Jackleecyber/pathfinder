import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { ChatController } from '../controllers/chatController';
import { logger } from '../utils/logger';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

const chatController = new ChatController();

/**
 * @swagger
 * /api/chat/messages:
 *   get:
 *     summary: Get chat messages
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of messages to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of messages to skip
 *     responses:
 *       200:
 *         description: List of chat messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatMessage'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/messages',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await chatController.getMessages(req.user!.id, {
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0,
      });
      res.json(result);
    } catch (error) {
      logger.error('Error getting chat messages:', error);
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Send a chat message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: The message content
 *               context:
 *                 type: object
 *                 description: Additional context for the message
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ChatMessage'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/send',
  [
    body('content').notEmpty().withMessage('Content is required'),
    body('context').optional().isObject().withMessage('Context must be an object'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await chatController.sendMessage(req.user!.id, {
        content: req.body.content,
        context: req.body.context,
      });
      res.json(result);
    } catch (error) {
      logger.error('Error sending chat message:', error);
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/chat/execute:
 *   post:
 *     summary: Execute a Cascade action
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CascadeAction'
 *     responses:
 *       200:
 *         description: Action executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CascadeAction'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/execute',
  [
    body('type').notEmpty().withMessage('Action type is required'),
    body('payload').notEmpty().withMessage('Payload is required'),
    body('confidence').isFloat({ min: 0, max: 1 }).withMessage('Confidence must be between 0 and 1'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await chatController.executeAction(req.user!.id, req.body);
      res.json(result);
    } catch (error) {
      logger.error('Error executing action:', error);
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/chat/suggestions:
 *   post:
 *     summary: Get AI suggestions for current context
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               context:
 *                 type: object
 *                 description: Current Excel context
 *               selectedRange:
 *                 type: object
 *                 description: Selected Excel range
 *     responses:
 *       200:
 *         description: AI suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CascadeAction'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/suggestions',
  [
    body('context').optional().isObject().withMessage('Context must be an object'),
    body('selectedRange').optional().isObject().withMessage('Selected range must be an object'),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const result = await chatController.getSuggestions(req.user!.id, {
        context: req.body.context,
        selectedRange: req.body.selectedRange,
      });
      res.json(result);
    } catch (error) {
      logger.error('Error getting suggestions:', error);
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/chat/clear:
 *   delete:
 *     summary: Clear chat history
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat history cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/clear',
  async (req, res, next) => {
    try {
      const result = await chatController.clearHistory(req.user!.id);
      res.json(result);
    } catch (error) {
      logger.error('Error clearing chat history:', error);
      next(error);
    }
  }
);

export { router as chatRoutes };

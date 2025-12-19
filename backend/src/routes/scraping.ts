import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { ScrapingController } from '../controllers/scrapingController';

const router = Router();
router.use(authMiddleware);

const scrapingController = new ScrapingController();

// Web scraping routes
router.post('/scrape', scrapingController.scrape);
router.get('/results', scrapingController.getResults);
router.delete('/:id', scrapingController.delete);

export { router as scrapingRoutes };

import { Router } from 'express';
import { ScrapingService } from '../../application/services/ScrapingService';
import { FeedUseCases } from '../../application/use-cases/FeedUseCases';
import { FeedRepository } from '../../infrastructure/repositories/FeedRepository';
import FeedController from '../controllers/FeedController';

const feedRepository = new FeedRepository();
const scrapingService = new ScrapingService(feedRepository);
const feedUseCases = new FeedUseCases(feedRepository, scrapingService);
const feedController = new FeedController(feedUseCases);

const router = Router();

router.get('/feeds', (req, res) => feedController.getFeeds(req, res));
router.get('/feeds/:id', (req, res) => feedController.getFeedById(req, res));
router.post('/feeds', (req, res) => feedController.newFeed(req, res));
router.put('/feeds/:id', (req, res) => feedController.updateFeed(req, res));
router.delete('/feeds/:id', (req, res) => feedController.deleteFeed(req, res));

export default router;

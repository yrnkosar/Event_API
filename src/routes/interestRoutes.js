import express from 'express';
import { getUserInterests, getRecommendations } from '../controllers/interestController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/:userId', protect, getUserInterests);
router.get('/recommendations/:userId', protect, getRecommendations);

export default router;
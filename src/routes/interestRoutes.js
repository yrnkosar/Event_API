import express from 'express';
import { getUserInterests, getRecommendations } from '../controllers/interestController.js';

const router = express.Router();

router.get('/:userId', getUserInterests);
router.get('/recommendations/:userId', getRecommendations);

export default router;
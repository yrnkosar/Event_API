import express from 'express';
import { getPointsByUser, calculateUserPoints } from '../controllers/pointController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/user-points/:userId', protect, getPointsByUser);

router.post('/calculate-points/:userId', protect, calculateUserPoints);

export default router;
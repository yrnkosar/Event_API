import express from 'express';
import { getPointsByUser, calculateUserPoints } from '../controllers/pointController.js';

const router = express.Router();

router.get('/user-points/:userId', getPointsByUser);

router.post('/calculate-points/:userId', calculateUserPoints);

export default router;
import express from 'express';
import { getPointsByUser } from '../controllers/pointController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/user-points', protect, getPointsByUser);

export default router;
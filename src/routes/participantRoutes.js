import express from 'express';
import { getParticipants } from '../controllers/participantController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/participants/:eventId', protect, getParticipants);

export default router;

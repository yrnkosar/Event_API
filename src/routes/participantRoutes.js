import express from 'express';
import { getParticipants } from '../controllers/participantController.js';

const router = express.Router();

router.get('/participants/:eventId', getParticipants);

export default router;

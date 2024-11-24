import express from 'express';
import { sendMessageToEvent, getEventMessages } from '../controllers/messageController.js';

const router = express.Router();

router.post('/send-message', sendMessageToEvent);

router.get('/event/:eventId/messages', getEventMessages);

export default router;

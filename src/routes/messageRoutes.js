import express from 'express';
import { sendMessageToEvent, getEventMessages, fetchNewMessages } from '../controllers/messageController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/send-message', protect, sendMessageToEvent);

router.get('/event/:eventId/messages', protect, getEventMessages);

router.get('/new-messages', protect, fetchNewMessages);

export default router;

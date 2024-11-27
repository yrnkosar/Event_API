import express from 'express';
import { sendMessageToEvent, getEventMessages, getNotifications } from '../controllers/messageController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/send-message', protect, sendMessageToEvent);

router.get('/event/:eventId/messages', protect, getEventMessages);

router.get('/notifications', protect, getNotifications);

export default router;

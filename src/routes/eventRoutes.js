import express from 'express';
import { createEvent, deleteEvent, updateEvent, getEvent, getEventsByCategoryAndSubcategory, controllergetEventsByDate, joinEvent, getAllEvents } from '../controllers/eventController.js';
import { protect, adminOnly } from '../utils/authMiddleware.js';

const router = express.Router();


router.post('/create-event', protect, createEvent);

router.delete('/delete-event/:id', protect, adminOnly, deleteEvent);

router.put('/update-event/:id', protect, adminOnly, updateEvent);

router.get('/get-event/:id', protect, getEvent);

router.get('/events', protect, getAllEvents);

router.get('/event-category', protect, getEventsByCategoryAndSubcategory);

router.get('/event-daterange', protect, controllergetEventsByDate);

router.post('/join/:eventId', protect, joinEvent); 

export default router;

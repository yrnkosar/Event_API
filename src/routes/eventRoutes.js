import express from 'express';
import { createEvent, deleteEvent, updateEvent, getEvent, getEventsByCategoryAndSubcategory, controllergetEventsByDate, joinEvent, getAllEvents,
    getCategories, getCategoriesController, } from '../controllers/eventController.js';
import { protect, adminOnly } from '../utils/authMiddleware.js';

const router = express.Router();


router.post('/create-event', protect, createEvent);

router.delete('/delete-event/:id', protect, deleteEvent);

router.put('/update-event/:id', protect, updateEvent);

router.get('/get-event/:id', protect, getEvent);

router.get('/events', protect, getAllEvents);

router.get('/event-category', protect, getEventsByCategoryAndSubcategory);

router.get('/event-daterange', protect, controllergetEventsByDate);

router.post('/join/:eventId', protect, joinEvent); 

router.get('/categories', protect, getCategories);

router.get('/subcategories', protect, getCategoriesController);

export default router;

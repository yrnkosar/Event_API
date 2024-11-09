import express from 'express';
import { createEvent, deleteEvent, updateEvent, getEvent } from '../controllers/eventController.js';

const router = express.Router();


router.post('/create-event', createEvent);

router.delete('/delete-event/:id', deleteEvent);

router.put('/update-event/:id', updateEvent);

router.get('/get-event/:id', getEvent);

export default router;

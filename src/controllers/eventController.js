import Event from '../models/event.js';
import { createEventService, deleteEventService, updateEventService, getEventService } from '../services/eventService.js';

export const createEvent = async (req, res) => {
    const { name, description, date, time, duration, latitude, longitude, user_id, subcategory_id } = req.body;

    try {
        const newEvent = await createEventService({ name, description, date, time, duration, latitude, longitude, user_id, subcategory_id });
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        res.status(400).json({ message: 'Failed to create event', error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteEventService(id);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete event', error: error.message });
    }
};

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedEvent = await updateEventService(id, updatedData);
        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update event', error: error.message });
    }
};

export const getEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await getEventService(id);
        res.status(200).json(event);
    } catch (error) {
        res.status(404).json({ message: 'Event not found', error: error.message });
    }
};

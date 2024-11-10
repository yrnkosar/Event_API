import { createEventService, deleteEventService, updateEventService, getEventService, getEventsByCategory, getEventsByDateRange } from '../services/eventService.js';

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

export const getEventsByCategoryAndSubcategory = async (req, res) => {
    const { categoryId, subcategoryId } = req.query;
    console.log(categoryId, subcategoryId);
    if (!categoryId || !subcategoryId) {
        return res.status(400).json({ message: 'Kategori ID ve Alt Kategori ID gereklidir' });
    }

    try {
        const events = await getEventsByCategory(categoryId, subcategoryId);
        const eventCount = events.length;

        res.status(200).json({ events, toplam: eventCount });
    } catch (error) {
        res.status(500).json({ message: 'Etkinlikler getirilemedi', error: error.message });
    }
};

export const controllergetEventsByDate = async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required' });
    }

    try {
        const events = await getEventsByDateRange(startDate, endDate);
        
        const eventCount = events.length;

        res.status(200).json({ events, total: eventCount });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve events by date range', error: error.message });
    }
};
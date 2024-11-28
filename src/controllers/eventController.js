import { createEventService, deleteEventService, updateEventService, getEventService, getEventsByCategory, getEventsByDateRange,
    joinEventService, getAllEventsService,
    getCategoriesService, getCategoriesWithSubcategories, leaveEventService
 } from '../services/eventService.js';

export const createEvent = async (req, res) => {
    const { name, description, date, time, duration, latitude, longitude, subcategory_id } = req.body;
    const user_id = req.user.id;

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

export const getAllEvents = async (req, res) => {
    try {
        const events = await getAllEventsService();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve events' });
    }
};

export const getEventsByCategoryAndSubcategory = async (req, res) => {
    const { categoryId, subcategoryId } = req.query;
    console.log(categoryId, subcategoryId);
    if (!categoryId || !subcategoryId) {
        return res.status(400).json({ message: 'Category ID and SubCategory ID are required' });
    }

    try {
        const events = await getEventsByCategory(categoryId, subcategoryId);
        const eventCount = events.length;

        res.status(200).json({ events, toplam: eventCount });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve events', error: error.message });
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

export const joinEvent = async (req, res) => {
    const userId = req.user.id;  
    const eventId = req.params.eventId;  

    try {
        const participant = await joinEventService(userId, eventId);
        res.status(200).json({ message: 'Joined event successfully', participant });
    } catch (error) {
        res.status(500).json({ message: 'Failed to join event', error: error.message });
    }
};

export const leaveEvent = async (req, res) => {
    const userId = req.user.id; 
    const eventId = req.params.eventId; 

    try {
        const result = await leaveEventService(userId, eventId);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to leave the event.',
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await getCategoriesService();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve categories' });
    }
};

export const getCategoriesController = async (req, res) => {
    try {
        const categories = await getCategoriesWithSubcategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve categories' });
    }
};


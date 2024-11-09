import Event from '../models/event.js';
import User from '../models/user.js';
import Subcategory from '../models/subcategory.js';

export const createEventService = async (data) => {
    try {
        const newEvent = await Event.create(data);
        return newEvent;
    } catch (error) {
        console.error('Error during event creation:', error);  
        throw new Error(`Failed to create event: ${error.message}`);
    }
};

export const deleteEventService = async (id) => {
    try {
        const event = await Event.findByPk(id);
        if (!event) {
            throw new Error('Event not found');
        }
        await event.destroy();
    } catch (error) {
        throw new Error('Failed to delete event');
    }
};

export const updateEventService = async (id, updatedData) => {
    try {
        const event = await Event.findByPk(id);
        if (!event) {
            throw new Error('Event not found');
        }
        const updatedEvent = await event.update(updatedData);
        return updatedEvent;
    } catch (error) {
        throw new Error('Failed to update event');
    }
};

export const getEventService = async (id) => {
    try {
        const event = await Event.findByPk(id, {
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Subcategory, attributes: ['id', 'name'] }
            ]
        });
        if (!event) {
            throw new Error('Event not found');
        }
        return event;
    } catch (error) {
        throw new Error('Failed to fetch event');
    }
};

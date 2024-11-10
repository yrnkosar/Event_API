import Event from '../models/event.js';
import User from '../models/user.js';
import Subcategory from '../models/subcategory.js';
import Category from '../models/category.js';
import Participant from '../models/participant.js';
import { Op } from 'sequelize';

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

export const getEventsByCategory = async (categoryId, subcategoryId) => {
    try {
        const events = await Event.findAll({
            include: [
                {
                    model: Subcategory,
                    where: { id: subcategoryId },
                    include: [
                        {
                            model: Category,
                            where: { id: categoryId },
                        }
                    ]
                }
            ]
        });
        return events;
    } catch (error) {
        throw new Error('Etkinlikler getirilemedi');
    }
};

export const getEventsByDateRange = async (startDate, endDate) => {
    try {
        const events = await Event.findAll({
            where: {
                date: {
                    [Op.gte]: startDate, 
                    [Op.lte]: endDate,   
                }
            }
        });
        return events;
    } catch (error) {
        throw new Error('Failed to fetch events by date range');
    }
};

export const joinEventService = async (userId, eventId) => {
    try {
        // Kullanıcı daha önce bu etkinliğe katılmış mı kontrol et
        const existingParticipant = await Participant.findOne({ where: { user_id: userId, event_id: eventId } });
        if (existingParticipant) {
            throw new Error('User has already joined this event');
        }

        // Yeni katılım kaydını oluştur
        const newParticipant = await Participant.create({ user_id: userId, event_id: eventId });
        return newParticipant;
    } catch (error) {
        throw new Error('Error joining event: ' + error.message);
    }
};
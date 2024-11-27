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

export const getAllEventsService = async () => {
    return await Event.findAll({
        where: { status: true } 
    });
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
        throw new Error('Failed to fetch events');
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
        const eventToJoin = await Event.findByPk(eventId);

        if (!eventToJoin) {
            throw new Error('Event not found');
        }

        const durationMatch = eventToJoin.duration.match(/^(\d+)/); 
        if (!durationMatch) {
            throw new Error('Invalid duration format. Expected a numeric value.');
        }
        const durationInHours = parseInt(durationMatch[1], 10);

        const startDateTime = new Date(eventToJoin.date);
        const timeParts = eventToJoin.time.split(':'); 
        startDateTime.setHours(timeParts[0], timeParts[1]);

        const eventToJoinEndDate = new Date(startDateTime);
        eventToJoinEndDate.setHours(eventToJoinEndDate.getHours() + durationInHours);

        const userParticipants = await Participant.findAll({
            where: { user_id: userId },
            include: [{ model: Event }],
        });

        const overlappingEvent = userParticipants.find((participant) => {
            const joinedEvent = participant.Event;

            const joinedStartDateTime = new Date(joinedEvent.date);
            const joinedTimeParts = joinedEvent.time.split(':');
            joinedStartDateTime.setHours(joinedTimeParts[0], joinedTimeParts[1]);

            const joinedEventEndDate = new Date(joinedStartDateTime);
            const joinedDurationMatch = joinedEvent.duration.match(/^(\d+)/);
            const joinedDurationInHours = joinedDurationMatch ? parseInt(joinedDurationMatch[1], 10) : 0;

            joinedEventEndDate.setHours(joinedEventEndDate.getHours() + joinedDurationInHours);

            return (
                (startDateTime < joinedEventEndDate && eventToJoinEndDate > joinedStartDateTime)
            );
        });

        if (overlappingEvent) {
            const overlappingEventName = overlappingEvent.Event?.name || 'another event';
            throw new Error(
                `You cannot join this event because it overlaps with: ${overlappingEventName}`
            );
        }

        const participant = await Participant.create({
            user_id: userId,
            event_id: eventId,
        });

        return participant;
    } catch (error) {
        console.error('Error in joinEventService:', error);
        throw new Error(error.message || 'Unknown error occurred while joining the event');
    }
};

export const getCategoriesService = async () => {
    return await Category.findAll();
};

export const getCategoriesWithSubcategories = async () => {
    return await Category.findAll({
        include: [{ model: Subcategory }]
    });
};

import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import Event from '../models/event.js';
import Interest from '../models/interest.js';
import Subcategory from '../models/subcategory.js';
import Category from '../models/category.js';
import Participant from '../models/participant.js';
import User from '../models/user.js';

export const getUserInterestsService = async (userId) => {
    try {
        const interests = await Interest.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Subcategory,
                    attributes: ['id', 'name'], 
                },
            ],
        });
        return interests;
    } catch (error) {
        throw new Error(`Failed to retrieve interests for user: ${error.message}`);
    }
};

export const getPersonalizedEventRecommendations = async (userId) => {
    try {
        const userInterests = await Interest.findAll({
            where: { user_id: userId },
            include: [{ model: Subcategory, include: [Category] }],
        });
        const interestSubcategoryIds = userInterests.map((interest) => interest.subcategory_id);

        const pastParticipationEvents = await Participant.findAll({
            where: { user_id: userId },
            include: [{ model: Event, include: [Subcategory] }],
        });
        const pastEventIds = pastParticipationEvents.map((participation) => participation.Event.id);
        const pastEventSubcategoryIds = pastParticipationEvents.map((participation) => participation.Event.subcategory_id);
        const categoryIdsForPastEvents = pastParticipationEvents.map((participation) => participation.Event.Subcategory.category_id);

        const otherSubcategoriesForPastEvents = await Subcategory.findAll({
            where: { category_id: { [Op.in]: categoryIdsForPastEvents } },
        });
        const otherSubcategoryIdsForPastEvents = otherSubcategoriesForPastEvents.map((subcategory) => subcategory.id);

        const allRelevantSubcategoryIds = [...new Set([
            ...interestSubcategoryIds,
            ...pastEventSubcategoryIds,
            ...otherSubcategoryIdsForPastEvents,
        ])];

        const user = await User.findByPk(userId);
        const userLatitude = user.location_latitude;
        const userLongitude = user.location_longitude;

        const recommendedEvents = await Event.findAll({
            where: {
                subcategory_id: { [Op.in]: allRelevantSubcategoryIds },
                id: { [Op.notIn]: pastEventIds }, 
                user_id: { [Op.ne]: userId }, 
                [Op.and]: [
                    Sequelize.literal(`CONCAT(date, ' ', time) > NOW()`), 
                ],
                status: true,
            },
            include: [
                { model: Subcategory },
                { model: User, attributes: ['id', 'username'] },
            ],
        });

        const weightedEvents = recommendedEvents.map((event) => {
            let weight = 1; 
            if (pastEventSubcategoryIds.includes(event.subcategory_id)) {
                weight = 2; 
            }
            const distance = calculateDistance(userLatitude, userLongitude, event.latitude, event.longitude);
            return { event, distance, weight };
        });

        const sortedEvents = weightedEvents
            .filter((item) => item.distance < 50) 
            .sort((a, b) => (a.distance - b.distance) || (b.weight - a.weight)); 

        return sortedEvents.map((item) => item.event);
    } catch (error) {
        throw new Error(`Failed to generate recommendations: ${error.message}`);
    }
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    return distance;
};
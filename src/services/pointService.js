import Event from '../models/event.js'
import Point from '../models/point.js'
import Participant from '../models/participant.js'

export const getUserPoints = async (userId) => {
    try {
        const points = await Point.findAll({
            where: { user_id: userId }
        });
        
        return points;
    } catch (error) {
        throw new Error('Error fetching user points: ' + error.message);
    }
};

export const calculateAndSaveUserPoints = async (userId) => {
    try {
        const userEvents = await Participant.findAll({
            where: { user_id: userId },
            include: [{ model: Event }],
        });

        const totalEvents = userEvents.length;

        let points = 0;
        if (totalEvents === 1) {
            points += 20; 
        } else if (totalEvents > 1) {
            points += 20; 
            points += 10 * (totalEvents - 1); 
        }

        const createdEvents = await Event.findAll({
            where: { user_id: userId },
        });
        const createdEventsCount = createdEvents.length;

        points += 15 * createdEventsCount; 

        const existingPoint = await Point.findOne({
            where: { user_id: userId },
        });

        if (existingPoint) {
            await existingPoint.update({
                points,
                earned_date: new Date(),
            });
        } else {
            await Point.create({
                user_id: userId,
                points,
                earned_date: new Date(),
            });
        }

        return points;
    } catch (error) {
        throw new Error('Error calculating points: ' + error.message);
    }
};
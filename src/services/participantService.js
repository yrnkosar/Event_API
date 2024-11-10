import Participant from '../models/participant.js';
import User from '../models/user.js';

export const getParticipantsByEventId = async (eventId) => {
    try {
        const participants = await Participant.findAll({
            where: { event_id: eventId },
            include: [{ model: User, attributes: ['username', 'email'] }],
        });
        return participants;
    } catch (error) {
        console.error('Error fetching participants:', error.message); 
        throw new Error('Failed to fetch participants');
    }
};

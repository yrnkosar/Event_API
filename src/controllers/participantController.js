import { getParticipantsByEventId } from '../services/participantService.js';

export const getParticipants = async (req, res) => {
    const { eventId } = req.params;
    try {
        const participants = await getParticipantsByEventId(eventId);
        res.status(200).json(participants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

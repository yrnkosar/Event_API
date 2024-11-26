import { sendMessage, getMessagesByEvent, getNewMessages } from '../services/messageService.js';

export const sendMessageToEvent = async (req, res) => {
    const { eventId, messageText } = req.body;
    const userId = req.user.id;

    try {
        const message = await sendMessage(userId, eventId, messageText);
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: message,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getEventMessages = async (req, res) => {
    const { eventId } = req.params;

    try {
        const messages = await getMessagesByEvent(eventId);
        res.status(200).json({
            success: true,
            messages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const fetchNewMessages = async (req, res) => {
    const { eventId, lastFetchedTime } = req.query;

    if (!eventId || !lastFetchedTime) {
        return res.status(400).json({
            success: false,
            message: 'eventId and lastFetchedTime are required.',
        });
    }

    try {
        const newMessages = await getNewMessages(eventId, lastFetchedTime);

        if (newMessages.length === 0) {
            return res.status(200).json({
                success: true,
                messages: [],
                message: 'No new messages.',
            });
        }

        return res.status(200).json({
            success: true,
            messages: newMessages,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

import { sendMessage, getMessagesByEvent, getNewNotifications } from '../services/messageService.js';

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

export const getNotifications = async (req, res) => {
    const userId = req.user.id;

    try {
        const notifications = await getNewNotifications(userId);
        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching notifications: ${error.message}`,
        });
    }
};

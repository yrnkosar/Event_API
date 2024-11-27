import Message from '../models/message.js';
import User from '../models/user.js';
import Sequelize from 'sequelize';
import Event from '../models/event.js';
import Participant from '../models/participant.js';

export const sendMessage = async (userId, eventId, messageText) => {
    const sentTime = new Date(); 

    try {
        const message = await Message.create({
            user_id: userId,
            event_id: eventId,
            message_text: messageText,
            sent_time: sentTime,
        });

        return message;
    } catch (error) {
        throw new Error('Error sending message: ' + error.message);
    }
};

export const getMessagesByEvent = async (eventId) => {
    try {
        const messages = await Message.findAll({
            where: { event_id: eventId },
            include: [{ model: User, attributes: ['id', 'username'] }],
            order: [['sent_time', 'ASC']], 
        });

        return messages;
    } catch (error) {
        throw new Error('Error fetching messages: ' + error.message);
    }
};

export const getNewNotifications = async (userId) => {
    try {
        const user = await User.findByPk(userId, { attributes: ['id', 'last_notification_check'] });
        if (!user) {
            throw new Error('User not found');
        }

        const lastCheck = user.last_notification_check || new Date(0);

        const participantEvents = await Participant.findAll({
            where: { user_id: userId },
            include: [{ model: Event, attributes: ['id', 'name'] }],
        });

        const eventIds = participantEvents.map(part => part.event_id);

        const newNotifications = await Message.findAll({
            where: {
                event_id: { [Sequelize.Op.in]: eventIds },
                sent_time: { [Sequelize.Op.gt]: lastCheck },
                user_id: { [Sequelize.Op.ne]: userId },
            },
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Event, attributes: ['id', 'name'] },
            ],
            order: [['sent_time', 'ASC']],
        });

        // Kullanıcının son bildirim kontrol zamanını güncelle
        await user.update({ last_notification_check: new Date() });

        return newNotifications;
    } catch (error) {
        throw new Error(`Error fetching new notifications: ${error.message}`);
    }
};



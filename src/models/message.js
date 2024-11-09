import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Event from './event.js';

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    event_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Event,
            key: 'id',
        },
    },
    message_text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    sent_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, { timestamps: false });

Message.belongsTo(User, { foreignKey: 'user_id' });
Message.belongsTo(Event, { foreignKey: 'event_id' });

export default Message;

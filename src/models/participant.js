// src/models/Participant.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Event from './event.js';

const Participant = sequelize.define('Participant', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // user_id birincil anahtar
        references: {
            model: User,
            key: 'id',
        },
    },
    event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // event_id birincil anahtar
        references: {
            model: Event,
            key: 'id',
        },
    },
}, { timestamps: false });

// İlişkiler
Participant.belongsTo(User, { foreignKey: 'user_id' });
Participant.belongsTo(Event, { foreignKey: 'event_id' });

export default Participant;

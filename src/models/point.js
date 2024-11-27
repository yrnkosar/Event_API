import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Event from './event.js';

const Point = sequelize.define('Point', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        primaryKey: true,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    earned_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, { 
    timestamps: false,
    tableName: 'points', 
    primaryKey: false 
});

Point.belongsTo(User, { foreignKey: 'user_id' });
Point.belongsTo(Event, { foreignKey: 'event_id' });

export default Point;

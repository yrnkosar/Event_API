import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js'; 
import Subcategory from './subcategory.js'; 

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    date: {
        type: DataTypes.DATE,
    },
    time: {
        type: DataTypes.TIME,
    },
    duration: {
        type: DataTypes.STRING,
    },
    latitude: {
        type: DataTypes.DOUBLE,
    },
    longitude: {
        type: DataTypes.DOUBLE,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Subcategory,
            key: 'id'
        }
    }
}, { timestamps: false });

Event.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Event, { foreignKey: 'user_id' });

Event.belongsTo(Subcategory, { foreignKey: 'subcategory_id' });
Subcategory.hasMany(Event, { foreignKey: 'subcategory_id' });


export default Event;

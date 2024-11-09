// src/models/Interest.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Subcategory from './subcategory.js';

const Interest = sequelize.define('Interest', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        primaryKey: true,  // user_id birincil anahtar olacak
    },
    subcategory_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Subcategory,
            key: 'id',
        },
        primaryKey: true,  // subcategory_id birincil anahtar olacak
    },
}, { timestamps: false });

// İlişkiler
Interest.belongsTo(User, { foreignKey: 'user_id' });
Interest.belongsTo(Subcategory, { foreignKey: 'subcategory_id' });

export default Interest;

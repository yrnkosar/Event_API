// src/models/Subcategory.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Category from './category.js';

const Subcategory = sequelize.define('Subcategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id',
        },
    },
}, { timestamps: false });

// İlişkiler
Subcategory.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Subcategory, { foreignKey: 'category_id' });

export default Subcategory;

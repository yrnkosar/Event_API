// src/models/Admin.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Admin = sequelize.define('Admin', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.ENUM('superadmin', 'moderator', 'admin'), // Farklı admin seviyeleri ekleyebilirsiniz
        defaultValue: 'admin',
    },
    permissions: {
        type: DataTypes.JSON, // JSON yapısı ile özelleştirilmiş izinler saklanabilir
        allowNull: true,
    },
}, { timestamps: true });

export default Admin;

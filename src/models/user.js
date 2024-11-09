import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    location_latitude: {
        type: DataTypes.DOUBLE,
    },
    location_longitude: {
        type: DataTypes.DOUBLE,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birth_date: {
        type: DataTypes.DATE
    },
    gender: {
        type: DataTypes.STRING
    },
    phone_number: {
        type: DataTypes.STRING
    },
    profile_picture_url: {
        type: DataTypes.TEXT
    },
    role: {
        type: DataTypes.STRING
    }
}, { timestamps: false });

export default User;

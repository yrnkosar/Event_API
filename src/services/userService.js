import User from '../models/User.mjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const register = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

export const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: config.jwtExpire,
    });
    return token;
};

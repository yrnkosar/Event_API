import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('User decoded:', req.user);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token verification failed' });
    }
};

export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
    next();
};

export const validateResetToken = (req, res, next) => {
    const token = req.query.token || req.body.token;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
};

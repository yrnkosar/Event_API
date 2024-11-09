import dotenv from 'dotenv';
dotenv.config();  
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; 
import {sendResetEmail} from '../services/userService.js'


export const registerUser = async (req, res) => {
    const { username, password, email, first_name, last_name, birth_date, gender, phone_number, location_latitude, location_longitude, profile_picture_url } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            password: hashedPassword,
            email,
            first_name,
            last_name,
            birth_date,
            gender,
            phone_number,
            location_latitude,
            location_longitude,
            profile_picture_url,
            role: 'kullanıcı' 
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ message: 'User registration failed', error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log(process.env.JWT_SECRET);

        const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error("Error:", error); 
        res.status(500).json({ message: 'Password reset failed', error: error.message });
    }
};


export const updateProfile = async (req, res) => {
    const { id } = req.user; 
    const updatedData = req.body;
    console.log(id);
    console.log(updatedData)

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update(updatedData);
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Profile update failed', error: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
};

// Şifre Sıfırlama Talebi
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Token oluştur
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Şifre sıfırlama bağlantısını oluştur
        const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

        // E-posta gönderme fonksiyonu çağır
        await sendResetEmail(user.email, resetUrl);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send password reset email', error: error.message });
    }
};

export const validateResetToken = (req, res, next) => {
    const token = req.query.token || req.body.token;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Doğrulanan kullanıcı bilgileri `req.user` olarak saklanır
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
};
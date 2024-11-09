import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

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


export const sendResetEmail = async (toEmail, resetUrl) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: toEmail,
        subject: 'Şifre Sıfırlama Talebi',
        html: `
            <p>Merhaba,</p>
            <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>Bu bağlantı 15 dakika boyunca geçerlidir.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Şifre sıfırlama e-postası ${toEmail} adresine gönderildi.`);
    } catch (error) {
        console.error('E-posta gönderim hatası:', error);
        throw new Error('Şifre sıfırlama e-postası gönderilemedi');
    }
};


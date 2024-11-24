import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';
import Event from '../models/event.js';
import Participant from '../models/participant.js';
import Subcategory from '../models/subcategory.js'; 
import Interest from '../models/interest.js';
import nodemailer from 'nodemailer'; 

dotenv.config();

export const registerUserService = async (userData) => {
    const { password, subcategory_ids, ...otherData } = userData; 
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        ...otherData,
        password: hashedPassword,
        role: 'kullanıcı',
    });

    if (subcategory_ids && subcategory_ids.length > 0) {
        const interests = subcategory_ids.map(subcategory_id => ({
            user_id: newUser.id,
            subcategory_id
        }));

        await Interest.bulkCreate(interests);
    }

    return newUser;
};

export const loginUserService = async (username, password) => {
    const user = await User.findOne({ where: { username } });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token };
};

export const resetPasswordService = async (email, newPassword) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return user;
};

export const updateProfileService = async (userId, updatedData) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    if (updatedData.password) {
        updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    await user.update(updatedData);
    return user;
};

export const getUserProfileService = async (userId) => {
    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) throw new Error('User not found');
    return user;
};

export const forgotPasswordService = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('User not found');

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    await sendResetEmail(user.email, resetUrl);
    return { resetUrl };
};


const sendResetEmail = async (toEmail, resetUrl) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.SMTP_USER,  
            pass: process.env.SMTP_PASS,  
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

export const getUserEventsService = async (userId) => {
    try {
        const createdEvents = await Event.findAll({
            where: { user_id: userId },
            include: [
                { model: User, attributes: ['username', 'email'] }, 
                { model: Subcategory, attributes: ['name'] }, 
            ]
        });

        const participatedEvents = await Participant.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Event,
                    include: [
                        { model: User, attributes: ['username'] }, 
                        { model: Subcategory, attributes: ['name'] }, 
                    ]
                }
            ]
        });

        return {
            createdEvents,   
            participatedEvents, 
        };
    } catch (error) {
        throw new Error('Error retrieving events: ' + error.message);
    }
};


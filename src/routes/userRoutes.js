// src/routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser, resetPassword, updateProfile, getUserProfile } from '../controllers/userController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

// Kullanıcı Kaydı
router.post('/register', registerUser);

// Kullanıcı Girişi
router.post('/login', loginUser);

// Şifre Sıfırlama
router.post('/reset-password', resetPassword);

// Kullanıcı Profilini Güncelleme (Korunan Rota)
router.put('/update-profile', protect, updateProfile);

// Kullanıcı Profilini Görüntüleme (Korunan Rota)
router.get('/profile', protect, getUserProfile);

export default router;

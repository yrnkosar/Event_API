import express from 'express';
import { registerUser, loginUser, resetPassword, updateProfile, getUserProfile, forgotPassword } from '../controllers/userController.js';
import { protect, validateResetToken } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/reset-password', validateResetToken, resetPassword);

router.put('/update-profile', protect, updateProfile);

router.get('/profile', protect, getUserProfile);

router.post('/forgot-password', forgotPassword);

export default router;

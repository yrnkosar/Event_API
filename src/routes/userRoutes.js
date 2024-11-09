import express from 'express';
import { registerUser, loginUser, resetPassword, updateProfile, getUserProfile } from '../controllers/userController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/reset-password', resetPassword);

router.put('/update-profile', protect, updateProfile);

router.get('/profile', protect, getUserProfile);

export default router;

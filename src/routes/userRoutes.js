import express from 'express';
import { registerUser, loginUser, resetPassword, updateProfile, getUserProfile, forgotPassword, getUserEventsController, addUserInterests } from '../controllers/userController.js';
import { protect, validateResetToken } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.put('/update-profile', protect, updateProfile);

router.get('/profile', protect, getUserProfile);

router.get('/user-events', protect, getUserEventsController);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', validateResetToken, resetPassword);

router.post('/interests', protect, addUserInterests);


export default router;

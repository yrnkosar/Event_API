// src/routes/adminRoutes.js
import express from 'express';
import { protect, adminOnly } from '../utils/authMiddleware.js';
import { getUsers, deleteUser } from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', protect, adminOnly, getUsers); 
router.delete('/users/:id', protect, adminOnly, deleteUser); 

export default router;

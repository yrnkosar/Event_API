import express from 'express';
import { getUsers, deleteUser, getEvents, deleteEvent,
    addCategory,
    addSubcategory,
    updateCategoryById,
    updateSubcategoryById,
    removeCategory,
    removeSubcategory,
    getOneUserById,
    changeEventStatus,
    getTotalUsers,
    getAgeDemographicsData,
    getTotalEvents,
    getEventsByMonth,
    getEventsByCategory,
    fetchInactiveEvents
 } from '../controllers/adminController.js';
 import { protect, adminOnly } from '../utils/authMiddleware.js';

const router = express.Router();


router.get('/users', protect, adminOnly, getUsers);
router.delete('/delete-user/:id', protect, adminOnly, deleteUser);
router.get('/user/:id', protect, getOneUserById);


router.get('/events', protect, adminOnly, getEvents);
router.delete('/events/:id', protect, adminOnly, deleteEvent);
router.patch('/events/:eventId/status', protect, adminOnly, changeEventStatus);
router.get('/inactive-events', protect, adminOnly, fetchInactiveEvents);


router.post('/add-categories', protect, adminOnly, addCategory);
router.put('/categories/:id', protect, adminOnly, updateCategoryById);
router.delete('/categories/:id', protect, adminOnly, removeCategory);

router.post('/add-subcategory', protect, adminOnly, addSubcategory);
router.put('/subcategories/:id', protect, adminOnly, updateSubcategoryById);
router.delete('/subcategories/:id', protect, adminOnly, removeSubcategory);

router.get('/total-users', protect, adminOnly, getTotalUsers);
router.get('/age-gender-demographics', protect, adminOnly, getAgeDemographicsData);
router.get('/total-events', protect, adminOnly, getTotalEvents);
router.get('/events-by-month', protect, adminOnly, getEventsByMonth);
router.get('/events-by-category', protect, adminOnly, getEventsByCategory);

export default router;

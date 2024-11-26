import express from 'express';
import { getUsers, deleteUser, getEvents, deleteEvent,
    addCategory,
    addSubcategory,
    updateCategoryById,
    updateSubcategoryById,
    removeCategory,
    removeSubcategory,
    getCategories, 
    getCategoriesController,
    getOneUserById,
    changeEventStatus,
    getTotalUsers,
    getAgeDemographicsData,
    getTotalEvents,
    getEventsByMonth,
    getEventsByCategory,
 } from '../controllers/adminController.js';
 import { protect, adminOnly } from '../utils/authMiddleware.js';

const router = express.Router();


router.get('/users', protect, adminOnly, getUsers);
router.delete('/delete-user/:id', protect, adminOnly, deleteUser);
router.get('/user/:id', protect, getOneUserById);


router.get('/events', protect, adminOnly, getEvents);
router.delete('/events/:id', protect, adminOnly, deleteEvent);
router.patch('/events/:eventId/status', protect, adminOnly, changeEventStatus);


router.get('/categories', protect, adminOnly, getCategories);
router.post('/add-categories', protect, adminOnly, addCategory);
router.put('/categories/:id', protect, adminOnly, updateCategoryById);
router.delete('/categories/:id', protect, adminOnly, removeCategory);

router.get('/subcategories', protect, adminOnly, getCategoriesController);
router.post('/add-subcategory', protect, adminOnly, addSubcategory);
router.put('/subcategories/:id', protect, adminOnly, updateSubcategoryById);
router.delete('/subcategories/:id', protect, adminOnly, removeSubcategory);

router.get('/total-users', getTotalUsers);
router.get('/age-demographics', getAgeDemographicsData);
router.get('/total-events', getTotalEvents);
router.get('/events-by-month', getEventsByMonth);
router.get('/events-by-category', getEventsByCategory);

export default router;

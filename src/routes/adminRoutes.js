import express from 'express';
import { getUsers, deleteUser, getEvents, deleteEvent,
    addCategory,
    addSubcategory,
    updateCategoryById,
    updateSubcategoryById,
    removeCategory,
    removeSubcategory,
    getCategories, 
    getCategoriesController
 } from '../controllers/adminController.js';

const router = express.Router();


router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);


router.get('/events', getEvents);
router.delete('/events/:id', deleteEvent);


router.get('/categories', getCategories);
router.post('/add-categories', addCategory);
router.put('/categories/:id', updateCategoryById);
router.delete('/categories/:id', removeCategory);

router.get('/subcategories', getCategoriesController);
router.post('/add-subcategory', addSubcategory);
router.put('/subcategories/:id', updateSubcategoryById);
router.delete('/subcategories/:id', removeSubcategory);

export default router;

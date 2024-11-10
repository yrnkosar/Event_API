import express from 'express';
import { getUsers, deleteUser, getEvents, deleteEvent,
    addCategory,
    addSubcategory,
    updateCategoryById,
    updateSubcategoryById,
    removeCategory,
    removeSubcategory,getCategories, getCategoriesController
 } from '../controllers/adminController.js';

const router = express.Router();

// User endpointleri
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

// Event endpointleri
router.get('/events', getEvents);
router.delete('/events/:id', deleteEvent);

// Kategoriler ve alt kategorileri getirme

// Yeni kategori ekleme
router.get('/categories', getCategories);

router.post('/add-categories', addCategory);

router.get('/subcategories', getCategoriesController);
// Yeni alt kategori ekleme
router.post('/add-subcategory', addSubcategory);

// Kategori güncelleme
router.put('/categories/:id', updateCategoryById);

// Alt kategori güncelleme
router.put('/subcategories/:id', updateSubcategoryById);

// Kategori silme
router.delete('/categories/:id', removeCategory);

// Alt kategori silme
router.delete('/subcategories/:id', removeSubcategory);

export default router;

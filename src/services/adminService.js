import User from '../models/user.js';
import Event from '../models/event.js';
import Category from '../models/category.js';
import Subcategory from '../models/subcategory.js';

// User servisleri
export const getUsersService = async () => {
    return await User.findAll();
};

export const deleteUserService = async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
};

// Event servisleri
export const getEventsService = async () => {
    return await Event.findAll();
};

export const deleteEventService = async (id) => {
    const event = await Event.findByPk(id);
    if (!event) throw new Error('Event not found');
    await event.destroy();
};

// Category servisleri

export const getCategoriesService = async () => {
    return await Category.findAll();
};

// Tüm kategorileri alt kategorileriyle beraber getirme
export const getCategoriesWithSubcategories = async () => {
    return await Category.findAll({
        include: [{ model: Subcategory }]
    });
};

// Yeni kategori oluşturma
export const createCategory = async (name) => {
    return await Category.create({ name });
};

// Yeni alt kategori oluşturma
export const createSubcategory = async (name, categoryId) => {
    return await Subcategory.create({ name, category_id: categoryId });
};

// Belirli bir kategoriyi güncelleme
export const updateCategory = async (id, name) => {
    const category = await Category.findByPk(id);
    if (category) {
        category.name = name;
        await category.save();
        return category;
    }
    throw new Error('Category not found');
};

// Belirli bir alt kategoriyi güncelleme
export const updateSubcategory = async (id, name) => {
    const subcategory = await Subcategory.findByPk(id);
    if (subcategory) {
        subcategory.name = name;
        await subcategory.save();
        return subcategory;
    }
    throw new Error('Subcategory not found');
};

// Kategori silme
export const deleteCategory = async (id) => {
    const category = await Category.findByPk(id);
    if (category) {
        await category.destroy();
        return { message: 'Category deleted' };
    }
    throw new Error('Category not found');
};

// Alt kategori silme
export const deleteSubcategory = async (id) => {
    const subcategory = await Subcategory.findByPk(id);
    if (subcategory) {
        await subcategory.destroy();
        return { message: 'Subcategory deleted' };
    }
    throw new Error('Subcategory not found');
};
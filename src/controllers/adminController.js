import { 
    getUsersService, deleteUserService, 
    getEventsService, deleteEventService, 
    getCategoriesWithSubcategories,
    createCategory,
    createSubcategory,
    updateCategory,
    updateSubcategory,
    deleteCategory,
    deleteSubcategory,
    getCategoriesService,
    getUserByIdService
} from '../services/adminService.js';

export const getUsers = async (req, res) => {
    try {
        const users = await getUsersService();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve users' });
    }
};

export const getOneUserById = async (req, res) => {
    const { id } = req.params;  

    try {
        const user = await getUserByIdService(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });  
    }
};

export const deleteUser = async (req, res) => {
    try {
        await deleteUserService(req.params.id);
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to delete user' });
    }
};

export const getEvents = async (req, res) => {
    try {
        const events = await getEventsService();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve events' });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        await deleteEventService(req.params.id);
        res.status(200).json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Failed to delete event' });
    }
};


export const getCategories = async (req, res) => {
    try {
        const categories = await getCategoriesService();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve categories' });
    }
};

export const getCategoriesController = async (req, res) => {
    try {
        const categories = await getCategoriesWithSubcategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve categories' });
    }
};

export const addCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const category = await createCategory(name);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create category' });
    }
};

export const addSubcategory = async (req, res) => {
    const { name, categoryId } = req.body;
    try {
        const subcategory = await createSubcategory(name, categoryId);
        res.status(201).json(subcategory);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create subcategory' });
    }
};

export const updateCategoryById = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const category = await updateCategory(id, name);
        res.status(200).json(category);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateSubcategoryById = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const subcategory = await updateSubcategory(id, name);
        res.status(200).json(subcategory);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const removeCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await deleteCategory(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const removeSubcategory = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await deleteSubcategory(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

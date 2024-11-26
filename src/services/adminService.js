import User from '../models/user.js';
import Event from '../models/event.js';
import Category from '../models/category.js';
import Subcategory from '../models/subcategory.js';
import { Sequelize } from 'sequelize';

export const getUsersService = async () => {
    return await User.findAll();
};

export const getUserByIdService = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteUserService = async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
};

export const getEventsService = async () => {
    return await Event.findAll();
};

export const deleteEventService = async (id) => {
    const event = await Event.findByPk(id);
    if (!event) throw new Error('Event not found');
    await event.destroy();
};

export const updateEventStatus = async (eventId) => {
    try {
        const event = await Event.findByPk(eventId);

        if (!event) {
            throw new Error('Event not found');
        }

        event.status = true;
        await event.save();

        return event;
    } catch (error) {
        throw new Error('Error updating event status: ' + error.message);
    }
};


export const getCategoriesService = async () => {
    return await Category.findAll();
};

export const getCategoriesWithSubcategories = async () => {
    return await Category.findAll({
        include: [{ model: Subcategory }]
    });
};

export const createCategory = async (name) => {
    return await Category.create({ name });
};

export const createSubcategory = async (name, categoryId) => {
    return await Subcategory.create({ name, category_id: categoryId });
};

export const updateCategory = async (id, name) => {
    const category = await Category.findByPk(id);
    if (category) {
        category.name = name;
        await category.save();
        return category;
    }
    throw new Error('Category not found');
};

export const updateSubcategory = async (id, name) => {
    const subcategory = await Subcategory.findByPk(id);
    if (subcategory) {
        subcategory.name = name;
        await subcategory.save();
        return subcategory;
    }
    throw new Error('Subcategory not found');
};

export const deleteCategory = async (id) => {
    const category = await Category.findByPk(id);
    if (category) {
        await category.destroy();
        return { message: 'Category deleted' };
    }
    throw new Error('Category not found');
};

export const deleteSubcategory = async (id) => {
    const subcategory = await Subcategory.findByPk(id);
    if (subcategory) {
        await subcategory.destroy();
        return { message: 'Subcategory deleted' };
    }
    throw new Error('Subcategory not found');
};

export const getTotalUserCount = async () => {
    return await User.count();
};

export const getAgeDemographics = async () => {
    const ageDemographics = await User.findAll({
        attributes: [
            [
                Sequelize.literal(`
                    CASE 
                        WHEN (YEAR(CURDATE()) - YEAR(birth_date)) BETWEEN 15 AND 30 THEN '15-30'
                        WHEN (YEAR(CURDATE()) - YEAR(birth_date)) BETWEEN 31 AND 45 THEN '31-45'
                        WHEN (YEAR(CURDATE()) - YEAR(birth_date)) BETWEEN 46 AND 60 THEN '46-60'
                        ELSE '60+'
                    END
                `),
                'age_group',
            ],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: [Sequelize.literal(`
            CASE 
                WHEN (YEAR(CURDATE()) - YEAR(birth_date)) BETWEEN 15 AND 30 THEN '15-30'
                WHEN (YEAR(CURDATE()) - YEAR(birth_date)) BETWEEN 31 AND 45 THEN '31-45'
                WHEN (YEAR(CURDATE()) - YEAR(birth_date)) BETWEEN 46 AND 60 THEN '46-60'
                ELSE '60+'
            END
        `)],
        raw: true,
    });

    return ageDemographics;
};

export const getTotalEventCount = async () => {
    return await Event.count();
};

export const getEventCountByMonth = async () => {
    const eventsByMonth = await Event.findAll({
        attributes: [
            [Sequelize.literal("MONTH(date)"), 'month'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: [Sequelize.literal("MONTH(date)")],
        raw: true,
    });
    return eventsByMonth;
};

export const getEventCountByCategory = async () => {
    const eventsByCategory = await Category.findAll({
        attributes: [
            'name',
            [Sequelize.fn('COUNT', Sequelize.col('Subcategories.Events.id')), 'count']
        ],
        include: [
            {
                model: Subcategory,
                attributes: [],
                include: [
                    {
                        model: Event,
                        attributes: [],
                    },
                ],
            },
        ],
        group: ['Category.id'],
        raw: true,
    });
    return eventsByCategory;
};
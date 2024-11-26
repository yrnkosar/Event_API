import { getUserInterestsService, getPersonalizedEventRecommendations } from '../services/interestService.js'


export const getUserInterests = async (req, res) => {
    const userId = req.user.id; 
    try {
        const interests = await getUserInterestsService(userId);
        res.status(200).json(interests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve user interests', error: error.message });
    }
};

export const getRecommendations = async (req, res) => {
    const userId = req.user.id;

    try {
        const recommendations = await getPersonalizedEventRecommendations(userId);
        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate recommendations', error: error.message });
    }
};
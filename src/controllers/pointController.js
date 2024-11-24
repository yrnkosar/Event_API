import { getUserPoints, calculateAndSaveUserPoints } from '../services/pointService.js';

export const getPointsByUser = async (req, res) => {
    const userId = req.params.userId; 

    try {
        const points = await getUserPoints(userId);
        
        if (points.length === 0) {
            return res.status(404).json({ success: false, message: 'No points found for this user.' });
        }

        return res.status(200).json({ success: true, points });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const calculateUserPoints = async (req, res) => {
    const userId = req.params.userId;

    try {
        const points = await calculateAndSaveUserPoints(userId);
        return res.status(200).json({ success: true, points });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

import { getUserPoints, calculateAndSaveUserPoints } from '../services/pointService.js';

export const getPointsByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const points = await calculateAndSaveUserPoints(userId);

        const userPoints = await getUserPoints(userId);

        if (userPoints.length === 0) {
            return res.status(404).json({ success: false, message: 'No points found for this user.' });
        }

        return res.status(200).json({ success: true, points: userPoints });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

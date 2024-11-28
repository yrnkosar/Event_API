import {
    registerUserService,
    loginUserService,
    resetPasswordService,
    updateProfileService,
    getUserProfileService,
    forgotPasswordService,
    getUserEventsService,
    addUserInterestsService,
    calculateRoutesService
} from '../services/userService.js';

export const registerUser = async (req, res) => {
    try {
        const newUser = await registerUserService(req.body);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ message: 'User registration failed', error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const { token, user } = await loginUserService(username, password);
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const email = req.user.email;

    try {
        await resetPasswordService(email, newPassword);
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Password reset failed', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    const { id } = req.user;
    const updatedData = req.body;

    try {
        const updatedUser = await updateProfileService(id, updatedData);
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Profile update failed', error: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await getUserProfileService(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        await forgotPasswordService(email);
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send password reset email', error: error.message });
    }
};

export const getUserEventsController = async (req, res) => {
    const { id } = req.user;

    try {
        const { createdEvents, participatedEvents } = await getUserEventsService(id);

        res.status(200).json({
            createdEvents,    
            participatedEvents,  
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get events', error: error.message });
    }
};

export const addUserInterests = async (req, res) => {
    const userId = req.user.id; 
    const { subcategoryIds } = req.body;

    if (!Array.isArray(subcategoryIds) || subcategoryIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Subcategory IDs are required and must be an array.',
        });
    }

    try {
        const result = await addUserInterestsService(userId, subcategoryIds);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add interests.',
        });
    }
};

export const calculateRoutesController = async (req, res) => {
    try {
      const userId = req.user.id; 
      const { eventId } = req.params; 
  
      if (!userId || !eventId) {
        return res.status(400).json({ message: 'User and event information are required' });
      }
  
      const routes = await calculateRoutesService(userId, eventId);
      res.status(200).json({ success: true, routes });
    } catch (error) {
      console.error('Error in calculateRoutesController:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };
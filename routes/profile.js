const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Profile = require('../models/Profile');

// Get user profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('profile');
        
        if (!user) {
            return res.status(404).json({ error: 'User profile not found' });
        }
        
        // Remove sensitive information
        const userData = user.toObject();
        delete userData.password;
        
        res.json({ 
            success: true,
            user: userData 
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Error fetching profile' });
    }
});

// Update user profile
router.put('/update', auth, async (req, res) => {
    try {
        const { bio, gameplayPreferences, avatarUrl } = req.body;
        
        if (!bio && !gameplayPreferences && !avatarUrl) {
            return res.status(400).json({ error: 'No update data provided' });
        }
        
        // Find and update profile
        const profile = await Profile.findOne({ user: req.userId });
        
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        // Update profile fields
        if (bio) profile.bio = bio;
        if (gameplayPreferences) profile.gameplayPreferences = gameplayPreferences;
        if (avatarUrl) profile.avatarUrl = avatarUrl;
        
        await profile.save();
        
        // Get updated user data
        const updatedUser = await User.findById(req.userId).populate('profile');
        const userData = updatedUser.toObject();
        delete userData.password;
        
        res.json({
            success: true,
            user: userData
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
});

// Delete user profile
router.delete('/delete', auth, async (req, res) => {
    try {
        // Delete profile
        await Profile.findOneAndDelete({ user: req.userId });
        
        // Delete user
        await User.findByIdAndDelete(req.userId);
        
        res.json({ 
            success: true,
            message: 'Profile deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ error: 'Error deleting profile' });
    }
});

module.exports = router;

module.exports = router;
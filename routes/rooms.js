const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User');

// Get all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find({ isActive: true })
            .select('name description level theme')
            .sort('level');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching rooms' });
    }
});

// Get specific room
router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching room' });
    }
});

// Complete room
router.post('/:id/complete', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const { score, timeRemaining } = req.body;
        const room = await Room.findById(req.params.id);
        
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Update user's score and completed rooms
        const user = await User.findById(req.session.userId);
        user.score += score;
        if (!user.completedRooms.includes(room._id)) {
            user.completedRooms.push(room._id);
        }
        await user.save();

        res.json({
            success: true,
            newScore: user.score,
            message: 'Room completed successfully'
        });
    } catch (error) {
        res.status(500).json({ error: 'Error completing room' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');
const User = require('../models/User');

// Start a room attempt
router.post('/start/:roomId', auth, async (req, res) => {
    try {
        const existingProgress = await Progress.findOne({
            player: req.user._id,
            room: req.params.roomId,
            isCompleted: false
        });

        if (existingProgress) {
            return res.json(existingProgress);
        }

        const progress = new Progress({
            player: req.user._id,
            room: req.params.roomId
        });

        await progress.save();
        res.status(201).json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Error starting room progress' });
    }
});

// Update puzzle progress
router.post('/puzzle/:progressId', auth, async (req, res) => {
    try {
        const { puzzleId, timeSpent, hintsUsed, pointsEarned } = req.body;
        
        const progress = await Progress.findOne({
            _id: req.params.progressId,
            player: req.user._id
        });

        if (!progress) {
            return res.status(404).json({ error: 'Progress not found' });
        }

        progress.puzzlesCompleted.push({
            puzzle: puzzleId,
            timeSpent,
            hintsUsed,
            pointsEarned
        });

        progress.timeSpent += timeSpent;

        // Update user's total score and hints used
        const user = await User.findById(req.user._id);
        user.score += pointsEarned;
        user.hintsUsed += hintsUsed;

        await Promise.all([progress.save(), user.save()]);

        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Error updating puzzle progress' });
    }
});

// Complete a room
router.post('/complete/:progressId', auth, async (req, res) => {
    try {
        const progress = await Progress.findOne({
            _id: req.params.progressId,
            player: req.user._id
        });

        if (!progress) {
            return res.status(404).json({ error: 'Progress not found' });
        }

        progress.isCompleted = true;
        progress.completedAt = new Date();

        // Add room to user's completed rooms
        const user = await User.findById(req.user._id);
        if (!user.completedRooms.includes(progress.room)) {
            user.completedRooms.push(progress.room);
        }

        await Promise.all([progress.save(), user.save()]);

        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Error completing room' });
    }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find()
            .select('username score hintsUsed completedRooms')
            .sort('-score')
            .limit(10);

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching leaderboard' });
    }
});

// Get user progress for a specific room
router.get('/room/:roomId', auth, async (req, res) => {
    try {
        const progress = await Progress.findOne({
            player: req.user._id,
            room: req.params.roomId
        }).populate('room');

        if (!progress) {
            return res.status(404).json({ error: 'Progress not found' });
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching room progress' });
    }
});

module.exports = router;
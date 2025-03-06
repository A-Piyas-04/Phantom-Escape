const express = require('express');
const router = express.Router();
const Leaderboard = require('../models/Leaderboard');

// Get global leaderboard
router.get('/global', async (req, res) => {
    try {
        const topPlayers = await Leaderboard.getGlobalTopPlayers(10);
        res.json(topPlayers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching global leaderboard' });
    }
});

// Get room-specific leaderboard
router.get('/room/:roomId', async (req, res) => {
    try {
        const topPlayers = await Leaderboard.getTopPlayers(req.params.roomId, 10);
        res.json(topPlayers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching room leaderboard' });
    }
});

// Update leaderboard entry when a room is completed
router.post('/update', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const { roomId, score, completionTime, hintsUsed } = req.body;

        const leaderboardEntry = new Leaderboard({
            user: req.session.userId,
            room: roomId,
            score,
            completionTime,
            hintsUsed
        });

        await leaderboardEntry.save();

        res.json({
            success: true,
            message: 'Leaderboard updated successfully'
        });
    } catch (error) {
        res.status(500).json({ error: 'Error updating leaderboard' });
    }
});

module.exports = router;
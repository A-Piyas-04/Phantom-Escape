const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Get puzzle hints
router.post('/:id/hint', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const { hintsUsed } = req.body;
        const room = await Room.findOne({ 'puzzles._id': req.params.id });
        
        if (!room) {
            return res.status(404).json({ error: 'Puzzle not found' });
        }

        const puzzle = room.puzzles.id(req.params.id);
        if (!puzzle) {
            return res.status(404).json({ error: 'Puzzle not found' });
        }

        // Check if there are hints available
        if (hintsUsed >= puzzle.hints.length) {
            return res.status(404).json({ error: 'No more hints available' });
        }

        const hint = puzzle.hints[hintsUsed];
        res.json({
            hintText: hint.text,
            pointPenalty: hint.pointPenalty
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching hint' });
    }
});

// Check puzzle solution
router.post('/:id/solve', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const { solution } = req.body;
        const room = await Room.findOne({ 'puzzles._id': req.params.id });
        
        if (!room) {
            return res.status(404).json({ error: 'Puzzle not found' });
        }

        const puzzle = room.puzzles.id(req.params.id);
        if (!puzzle) {
            return res.status(404).json({ error: 'Puzzle not found' });
        }

        const isCorrect = puzzle.solution === solution;
        res.json({
            correct: isCorrect,
            points: isCorrect ? puzzle.points : 0
        });
    } catch (error) {
        res.status(500).json({ error: 'Error checking solution' });
    }
});

module.exports = router;
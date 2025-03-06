const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficultyLevel: {
        type: Number,
        required: true
    },
    timeLimit: {
        type: Number,
        required: true
    },
    sequenceOrder: {
        type: Number,
        required: true
    },
    puzzles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Puzzle'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
roomSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Room', roomSchema);
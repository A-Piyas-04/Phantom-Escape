const mongoose = require('mongoose');

const hintSchema = new mongoose.Schema({
    hintText: {
        type: String,
        required: true
    },
    pointPenalty: {
        type: Number,
        required: true
    }
});

const puzzleSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    solution: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    hints: [hintSchema],
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
puzzleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Puzzle', puzzleSchema);
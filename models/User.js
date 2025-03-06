const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    completedRooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    solvedPuzzles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Puzzle'
    }],
    achievements: [{
        type: String
    }],
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
});

module.exports = mongoose.model('User', userSchema);
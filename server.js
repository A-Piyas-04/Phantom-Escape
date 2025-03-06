require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
connectDB().then(() => {
    // Only start the server after successful database connection
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});

// Middleware
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Routes - Load conditionally to handle missing modules
try {
    app.use('/api/auth', require('./routes/auth'));
    console.log('Auth routes loaded successfully');
} catch (error) {
    console.error('Failed to load auth routes:', error.message);
}

try {
    app.use('/api/profile', require('./routes/profile'));
    console.log('Profile routes loaded successfully');
} catch (error) {
    console.error('Failed to load profile routes:', error.message);
}

try {
    app.use('/api/rooms', require('./routes/rooms'));
    console.log('Room routes loaded successfully');
} catch (error) {
    console.error('Failed to load room routes:', error.message);
}

try {
    app.use('/api/puzzles', require('./routes/puzzles'));
    console.log('Puzzle routes loaded successfully');
} catch (error) {
    console.error('Failed to load puzzle routes:', error.message);
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

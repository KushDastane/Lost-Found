const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const foundRoutes = require('./routes/found');
const lostRoutes = require('./routes/lost');
const claimRoutes = require('./routes/claim');
const { errorHandler } = require('./middleware/errorMiddleware');

mongoose.set('strictQuery', false);

// Middleware
app.use(cors());

// Serve static frontend files and assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', express.static(path.join(__dirname, '..', 'frontend', 'pages', 'Auth')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/images', express.static(path.join(__dirname, '..', 'frontend', 'images')));
app.use('/js', express.static(path.join(__dirname, '..', 'frontend', 'js')));
app.use('/pages', express.static(path.join(__dirname, '..', 'frontend', 'pages')));
app.use('/uploads', express.static('uploads')); // For uploaded images

// Frontend routes serving HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'home', 'homepage.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'Auth', 'login.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'Auth', 'Sign up.html'));
});
app.get('/catalogues', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'Catalogues', 'Catlog.html'));
});
app.get('/claim', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'claim', 'claim.html'));
});
app.get('/found', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'found', 'found.html'));
});
app.get('/lost', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'lost', 'lost.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/found', foundRoutes);
app.use('/api/lost', lostRoutes);
app.use('/api/claim', claimRoutes);

// Test route
app.get('/ping', (req, res) => res.send('Server is alive'));

// Error handler
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(process.env.PORT || 5000, () =>
            console.log(`Server running on port ${process.env.PORT || 5000}`)
        );
    })
    .catch((error) => console.error('MongoDB connection failed:', error));

const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const app = express();
app.use(express.json());
const authRoutes = require('./routes/auth');
const foundRoutes = require('./routes/found'); // Import the found items route
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();


app.use('/api/claim', require('./routes/claim'));

app.use('/uploads', express.static('uploads'));

mongoose.set('strictQuery', false);

// Middleware
app.use(cors());
app.use('/api/auth', authRoutes); 

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'home', 'homepage.html'));
});
app.use('/uploads', express.static('uploads')); // Serve uploaded images
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/found', foundRoutes); // Mount the found route
app.use('/api/lost', require('./routes/lost'));
// app.use('/api/claim', require('./routes/claim'));

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

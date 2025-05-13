const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


// Signup route
router.post('/signup', registerUser);

// Login route
router.post('/login', loginUser);

// Verify route to check if the user is authenticated
router.get('/verify', authMiddleware, (req, res) => {
    // If we reach here, the token is valid, so return a success response
        res.status(200).json({ success: true, message: "User is authenticated" });
});

module.exports = router;

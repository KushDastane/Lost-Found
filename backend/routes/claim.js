const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const claimController = require('../controllers/claimController');

// Submit a claim (requires login)
router.post('/', authMiddleware, claimController.submitClaim);

module.exports = router;

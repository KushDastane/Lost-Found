const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createLostItem } = require('../controllers/lostController');

// POST /api/lost - create a new lost item
router.post('/', upload.single('item_image'), createLostItem);

module.exports = router;

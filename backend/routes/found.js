const express = require('express');
const router = express.Router();
const multer = require('multer'); // For handling file uploads
const upload = require('../middleware/upload');
const { createFoundItem } = require('../controllers/foundController'); // Import controller


// Use controller function for POST route to handle the found item form submission
router.post('/found', upload.single('item_image'), createFoundItem);

router.get('/', async (req, res) => {
    try {
        // Fetch found items where claimed is false or claimed field does not exist (for older items)
        const foundItems = await require('../models/FoundItem').find({
            $or: [
                { claimed: false },
                { claimed: { $exists: false } }
            ]
        });
        res.json(foundItems); // Send them as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

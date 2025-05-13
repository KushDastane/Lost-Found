const LostItem = require('../models/LostItem');

const createLostItem = async (req, res) => {
    try {
        const { name, description, category, dateLost, locationLost, user_name, user_email, college_id, itemFeatures } = req.body;

        // Get image URL from uploaded file if present
        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // Create a new lost item
        const newLostItem = new LostItem({
            name,
            description,
            category,
            dateLost,
            locationLost,
            imageUrl,
            user_name,
            user_email,
            college_id,
            itemFeatures,
        });

        await newLostItem.save();
        res.status(201).json({ message: "Lost item created successfully!" });
    } catch (error) {
        console.error("Error creating lost item:", error);
        res.status(400).json({ message: "Error creating lost item", error: error.message || error.toString() });
    }
};

module.exports = { createLostItem };

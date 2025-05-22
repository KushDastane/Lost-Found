const FoundItem = require('../models/FoundItem');
const LostItem = require('../models/LostItem');
const sendLostReporterNotification = require('../utils/mailer').sendLostReporterNotification;
const { areSentencesSimilar } = require('../utils/huggingface');

const createFoundItem = async (req, res) => {
    try {
        console.log('Received req.body:', req.body);
        console.log('Received req.file:', req.file);
        console.log('Image URL Cloudinary returned:', req.file?.path || 'No path');


        const { name, description, category, dateFound, locationFound, user_name, user_email, college_id, item_features, secretQuestion, secretAnswer } = req.body;

        if (!user_email) {
            console.warn('Warning: user_email is missing in the request body');
        }

        // Get image URL from uploaded file if present
        let imageUrl = '';
        if (req.file && req.file.path) {
            imageUrl = req.file.path; // Cloudinary provides a public URL here
        }


        // Create a new found item
        const newFoundItem = new FoundItem({
            name,
            description,
            category,
            dateFound,
            locationFound,
            imageUrl, // Save the image URL if uploaded
            user_name,  // Correct field names from destructured req.body
            user_email, // Correct field names from destructured req.body
            college_id, // Correct field names from destructured req.body
            itemFeatures: item_features,
            secretQuestion,
            secretAnswer,  // Added the secret answer to save as well
        });

        await newFoundItem.save();

        // Find matching lost items
        const lostItems = await LostItem.find({ category, locationLost:locationFound });
        console.log(`Matching lost items with category: ${category} and location: ${locationFound}`);
        lostItems.forEach(item => console.log(`Lost item user_email: ${item.user_email}`));


        for (const lostItem of lostItems) {
            console.log(`Checking lost item: ${lostItem._id}`);

            if (lostItem.user_email) {
                console.log(`Preparing to send notification email to lost reporter: ${lostItem.user_email}`);
                console.log('Found item details:', {
                    name: newFoundItem.name,
                    description: newFoundItem.description,
                    category: newFoundItem.category,
                    locationFound: newFoundItem.locationFound,
                    user_name: newFoundItem.user_name,
                    user_email: newFoundItem.user_email
                });
                try {
                    await sendLostReporterNotification(
                        lostItem.user_email,
                        newFoundItem.toObject(),
                        lostItem.user_name || 'Not provided',
                        lostItem.user_email || 'Not provided'
                    );
                    console.log(`Notification email sent to: ${lostItem.user_email}`);
                    } catch (emailError) {
                        console.error(`Error sending notification email to ${lostItem.user_email}:`, emailError);
                        console.error('Email details:', {
                            to: lostItem.user_email,
                            foundItemName: newFoundItem.name,
                            foundItemDescription: newFoundItem.description,
                            foundItemCategory: newFoundItem.category,
                        });
                    }
            } else {
                console.warn(`Lost item ${lostItem._id} has no user_email, skipping notification.`);
            }
        }

        res.status(201).json({ message: "Found item created successfully!" });
    } catch (error) {
        console.error('Error in createFoundItem:', error);
        res.status(400).json({ message: "Error creating found item", error: error.message || error.toString() });
    }
};

module.exports = { createFoundItem };

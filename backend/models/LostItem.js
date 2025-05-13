const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    dateLost: { type: Date, required: true },
    locationLost: String,
    imageUrl: String,
    user_name: { type: String, required: true },
    user_email: { type: String, required: true },
    college_id: { type: String, required: true },
    itemFeatures: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LostItem', lostItemSchema);

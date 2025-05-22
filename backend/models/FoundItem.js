const mongoose = require('mongoose');
const foundItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    dateFound: { type: Date, required: true },
    locationFound:{ type: String, required: true},
    imageUrl: String,
    secretQuestion: { type: String, required: true },
    secretAnswer: { type: String, required: true },
    user_name: String,        // NEW
    user_email: String,       // NEW
    college_id: String,       // NEW
    claimed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FoundItem', foundItemSchema);




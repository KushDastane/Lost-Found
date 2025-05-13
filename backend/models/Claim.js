const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoundItem',
        required: true,
    },
    claimantName: {
        type: String,
        required: true,
    },
    claimantEmail: {
        type: String,
        required: true,
    },
    collegeId: {
        type: String,
        required: true,
    },
    secretAnswer: {
        type: String,
        required: true,
    },
    additionalInfo: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isMatch: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Claim', claimSchema);

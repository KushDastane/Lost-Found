const Claim = require('../models/Claim');
const FoundItem = require('../models/FoundItem');

const { sendClaimNotification } = require('../utils/mailer');
const { areSentencesSimilar } = require('../utils/huggingface');

exports.submitClaim = async (req, res) => {
    try {
        const { itemId, claimantName, claimantEmail, collegeId, secretAnswer, additionalInfo } = req.body;

        // Find the corresponding found item
        const foundItem = await FoundItem.findById(itemId);

        // Log foundItem data to check if it has correct fields
        console.log('Found item data:', foundItem);

        if (!foundItem) {
            return res.status(404).json({ message: 'Found item not found.' });
        }

        // Use a lower threshold and enable debug logging for similarity check
        const isMatch = await areSentencesSimilar(foundItem.secretAnswer, secretAnswer, 0.7, true);

        console.log(`Secret answer: "${foundItem.secretAnswer}", Claimant answer: "${secretAnswer}", isMatch: ${isMatch}`);

        // Save the claim to DB
        const claim = new Claim({
            itemId,
            claimantName,
            claimantEmail,
            collegeId,
            secretAnswer,
            additionalInfo,
            isMatch
        });

        await claim.save();

        // Send email to the claimant
        if (isMatch) {
            // Mark the found item as claimed
            foundItem.claimed = true;
            await foundItem.save();

            // Use the mailer utility to send the email
            await sendClaimNotification(
                claimantEmail,
                foundItem,
                foundItem.user_name || 'Not provided',
                foundItem.user_email || 'Not provided'
            );
        }

        res.status(201).json({
            message: 'Claim submitted successfully.',
            isMatch,
            claimId: claim._id
        });
    } catch (err) {
        console.error("Error in submitClaim:", err);
        res.status(500).json({ message: 'Error submitting claim.', error: err.message || err.toString() });
    }
};

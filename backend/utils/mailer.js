const nodemailer = require('nodemailer');
const { EMAIL_USER } = process.env;
let { EMAIL_PASS } = process.env;
if (EMAIL_PASS) {
    EMAIL_PASS = EMAIL_PASS.trim();
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

const sendClaimNotification = async (claimantEmail, foundItem, founderName, founderEmail) => {
    const mailOptions = {
        from: EMAIL_USER,
        to: claimantEmail,
        subject: `Claim for ${foundItem.name} has been verified`,
        html: `
            <h2>Your claim for ${foundItem.name} has been verified!</h2>
            <p>Details of the founder who uploaded the item:</p>
            <p><strong>Found Item:</strong> ${foundItem.name}</p>
            <p><strong>Description:</strong> ${foundItem.description}</p>
            <p><strong>Category:</strong> ${foundItem.category}</p>
            <p><strong>Location:</strong>${foundItem.locactionFound}</p>
            <p><strong>Founder Details:</strong></p>
            <p><strong>Name:</strong> ${founderName}</p>
            <p><strong>Email:</strong> ${founderEmail}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent to: ', claimantEmail);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendLostReporterNotification = async (lostReporterEmail, foundItem, reporterName, reporterEmail) => {
    const mailOptions = {
        from: EMAIL_USER,
        to: lostReporterEmail,
        subject: `A found item matches your lost item description: ${foundItem.name}`,
        html: `
            <h2>A found item matches your lost item description!</h2>
            <p>Details of the found item:</p>
            <p><strong>Found Item:</strong> ${foundItem.name}</p>
            <p><strong>Description:</strong> ${foundItem.description}</p>
            <p><strong>Category:</strong> ${foundItem.category}</p>
            <p>Please visit our website & check catalogue.</p>
        `
    };

    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await transporter.sendMail(mailOptions);
            console.log('Notification email sent to lost reporter: ', lostReporterEmail);
            break;
        } catch (error) {
            console.error(`Error sending notification email (attempt ${attempt}):`, error);
            if (attempt === maxRetries) {
                console.error('Email details:', mailOptions);
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
            }
        }
    }
};

module.exports = {
    sendClaimNotification,
    sendLostReporterNotification
};

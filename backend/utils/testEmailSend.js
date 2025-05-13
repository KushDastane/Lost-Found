const nodemailer = require('nodemailer');

const { EMAIL_USER, EMAIL_PASS } = process.env;

async function sendTestEmail() {
    if (!EMAIL_USER || !EMAIL_PASS) {
        console.error('EMAIL_USER or EMAIL_PASS environment variables are not set.');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    const mailOptions = {
        from: EMAIL_USER,
        to: EMAIL_USER,
        subject: 'Test Email from Lost and Found App',
        text: 'This is a test email to verify SMTP configuration.'
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Test email sent:', info.response);
    } catch (error) {
        console.error('Error sending test email:', error);
    }
}

sendTestEmail();

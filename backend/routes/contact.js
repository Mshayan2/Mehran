const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Config for sending emails
// You might need to use an App Password if using Gmail
// Or use your own SMTP server details
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shayan1236y@gmail.com', // Sender email
        pass: process.env.EMAIL_PASS // Sender password (app password)
    }
});

router.post('/send', async (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email, // The user's email who filled the form
        to: 'shayan1236y@gmail.com', // Receiver email
        subject: `Portfolio Contact from ${name}`,
        text: `
            Name: ${name}
            Email: ${email}
            Message:
            ${message}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

module.exports = router;

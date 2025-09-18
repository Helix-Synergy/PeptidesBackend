const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends an email with optional attachments.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject line.
 * @param {string} htmlContent - HTML content of the email.
 * @param {Array<Object>} attachments - An array of attachment objects.
 */
const sendEmail = async (to, subject, htmlContent, attachments = []) => {
    try {
        const mailOptions = {
            from: `"Peptides Knowledge Park" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: htmlContent,
            attachments: attachments
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
    }
};

module.exports = { sendEmail };
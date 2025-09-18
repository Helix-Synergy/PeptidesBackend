const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/emailSender');
const { ownerTemplate, confirmationTemplate } = require('../utils/emailTemplates');

router.post('/', async (req, res) => {
    try {
        // Debug log – see exactly what frontend sends
        // console.log("📩 Received contact form data:", req.body);

        const formData = req.body || {};
        const formName = 'Contact Form';

        // Validation: make sure at least email is provided
        if (!formData.email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // Safely combine first + last name (fallbacks included)
        const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ') 
            || formData.name 
            || "Valued User";

        // 1. Send confirmation email to the user
        const userSubject = `Thank You for Your Inquiry!`;
        const userHtml = confirmationTemplate(fullName, formName);
        await sendEmail(formData.email, userSubject, userHtml);

        // 2. Send notification email to the owner
        const ownerSubject = `New ${formName} Submission`;
        const ownerHtml = ownerTemplate(formData, formName);
        await sendEmail(process.env.OWNER_EMAIL, ownerSubject, ownerHtml);

        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('❌ Error handling contact form submission:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

module.exports = router;

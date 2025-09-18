const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/emailSender');
const { ownerTemplate, confirmationTemplate } = require('../utils/emailTemplates');

router.post('/collaborate', async (req, res) => {
    try {
        const formData = req.body;
        const formName = 'Collaboration Form';

        // Validate required fields
        if (!formData.name || !formData.type || !formData.email || !formData.message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Send email to the owner
        const ownerSubject = `New ${formName} Request`;
        const ownerHtml = ownerTemplate(formData, formName);
        await sendEmail(process.env.OWNER_EMAIL, ownerSubject, ownerHtml);

        // Send confirmation email to the user
        const userSubject = `Confirmation: ${formName} Submission`;
        const userHtml = confirmationTemplate(formData.name, formName);
        await sendEmail(formData.email, userSubject, userHtml);

        res.status(200).json({ message: 'Collaboration request submitted successfully! We will reach out to you soon.' });
    } catch (error) {
        console.error('Error sending collaboration form emails:', error);
        res.status(500).json({ message: 'Failed to submit the collaboration request. Please try again later.' });
    }
});

module.exports = router;
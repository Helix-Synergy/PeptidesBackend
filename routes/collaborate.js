const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/emailSender');
const { ownerTemplate, confirmationTemplate } = require('../utils/emailTemplates');
const fs = require('fs');
const { Collaborate } = require('../models/FormSchemas');

router.get('/collaborate', async (req, res) => {
    try {
        const query = req.query.source === 'Peptides'
            ? { $or: [{ source: 'Peptides' }, { source: { $exists: false } }] }
            : (req.query.source ? { source: req.query.source } : {});
        const items = await Collaborate.find(query).sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests' });
    }
});

router.post('/collaborate', async (req, res) => {
    try {
        const formData = req.body;
        const formName = 'Collaboration Form';

        // Validate required fields
        if (!formData.name || !formData.type || !formData.email || !formData.message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // 1. Save to Database
        const collaborate = new Collaborate(formData);
        await collaborate.save();
        console.log("✅ Collaboration request saved to DB:", collaborate._id);

        try {
            // 2. Send Emails
            // Send email to the owner
            const ownerSubject = `New ${formName} Request`;
            const ownerHtml = ownerTemplate(formData, formName);
            await sendEmail(process.env.OWNER_EMAIL, ownerSubject, ownerHtml);

            // Send confirmation email to the user
            const userSubject = `Confirmation: ${formName} Submission`;
            const userHtml = confirmationTemplate(formData.name, formName);
            await sendEmail(formData.email, userSubject, userHtml);
        } catch (emailError) {
            console.error("⚠️ Email failed but data saved:", emailError.message);
        }

        res.status(200).json({ message: 'Collaboration request submitted successfully! We will reach out to you soon.' });
    } catch (error) {
        console.error('Error sending collaboration form emails:', error);
        res.status(500).json({ message: 'Failed to submit the collaboration request. Please try again later.' });
    }
});

module.exports = router;
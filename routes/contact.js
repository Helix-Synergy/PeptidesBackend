const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const upload = multer();
const { sendEmail } = require('../utils/emailSender');
const { ownerTemplate, confirmationTemplate } = require('../utils/emailTemplates');
const { Contact } = require('../models/FormSchemas');

router.get('/', async (req, res) => {
    try {
        const query = req.query.source === 'Peptides'
            ? { $or: [{ source: 'Peptides' }, { source: { $exists: false } }] }
            : (req.query.source ? { source: req.query.source } : {});
        const contacts = await Contact.find(query).sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});

router.post('/', upload.none(), async (req, res) => {
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

        // Fix: Map 'mobile' from frontend to 'phone' in schema
        if (formData.mobile && !formData.phone) {
            formData.phone = formData.mobile;
        }

        // 1. Save to Database (PRIMARY)
        const contact = new Contact(formData);
        await contact.save();
        console.log("✅ Contact saved to DB:", contact._id);

        try {
            // 2. Send emails (SECONDARY)
            const userSubject = `Thank You for Your Inquiry!`;
            const userHtml = confirmationTemplate(fullName, formName);
            await sendEmail(formData.email, userSubject, userHtml);

            const ownerSubject = `New ${formName} Submission`;
            const ownerHtml = ownerTemplate(formData, formName);
            await sendEmail(process.env.OWNER_EMAIL, ownerSubject, ownerHtml);
        } catch (emailError) {
            console.error("⚠️ Email failed but data saved:", emailError.message);
            // We still return success because data is safe
        }

        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('❌ Error handling contact form submission:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

module.exports = router;

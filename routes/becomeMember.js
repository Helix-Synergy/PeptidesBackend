const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendEmail } = require('../utils/emailSender');
const { ownerTemplate, confirmationTemplate } = require('../utils/emailTemplates');
const path = require('path');
const { Member } = require('../models/FormSchemas');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const query = req.query.source === 'Peptides'
            ? { $or: [{ source: 'Peptides' }, { source: { $exists: false } }] }
            : (req.query.source ? { source: req.query.source } : {});
        const members = await Member.find(query).sort({ createdAt: -1 });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching members' });
    }
});

router.post('/', upload.single('profileImage'), async (req, res) => {
    const uploadedFile = req.file;
    const formData = req.body;
    const userEmail = formData.email;
    const formName = 'Become a Member';

    try {
        // Fix: Map 'mobile' from frontend to 'phone' in schema
        if (formData.mobile && !formData.phone) {
            formData.phone = formData.mobile;
        }

        // 1. Save to Database
        const memberData = { ...formData, profileImage: uploadedFile ? uploadedFile.path : null };
        const member = new Member(memberData);
        await member.save();
        console.log("✅ Member Registration saved to DB:", member._id);

        try {
            // 2. Send Emails
            const attachments = uploadedFile ? [{
                filename: uploadedFile.originalname,
                path: uploadedFile.path
            }] : [];

            const ownerSubject = `New ${formName} Submission`;
            const ownerHtml = ownerTemplate(formData, formName);
            await sendEmail(process.env.OWNER_EMAIL, ownerSubject, ownerHtml, attachments);

            const userSubject = `Confirmation: ${formName} Submission`;
            const userHtml = confirmationTemplate(formData.firstName, formName);
            await sendEmail(userEmail, userSubject, userHtml, attachments);
        } catch (emailError) {
            console.error("⚠️ Email failed but data saved:", emailError.message);
        }

        res.status(200).json({ success: true, message: 'Application submitted successfully!' });
    } catch (error) {
        console.error('Error handling member form submission:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    } finally {
        // Do NOT delete the file - we need it for the dashboard!
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendEmail } = require('../utils/emailSender');
const { ownerTemplate, confirmationTemplate } = require('../utils/emailTemplates');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('profileImage'), async (req, res) => {
    const uploadedFile = req.file;
    const formData = req.body;
    const userEmail = formData.email;
    const formName = 'Become a Member';

    try {
        // Prepare attachment for both emails
        const attachments = uploadedFile ? [{
            filename: uploadedFile.originalname,
            path: uploadedFile.path
        }] : [];

        // Send email to the owner
        const ownerSubject = `New ${formName} Submission`;
        const ownerHtml = ownerTemplate(formData, formName);
        await sendEmail(process.env.OWNER_EMAIL, ownerSubject, ownerHtml, attachments);

        // Send confirmation email to the user with the attachment
        const userSubject = `Confirmation: ${formName} Submission`;
        const userHtml = confirmationTemplate(formData.firstName, formName);
        await sendEmail(userEmail, userSubject, userHtml, attachments);

        res.status(200).json({ success: true, message: 'Application submitted successfully!' });
    } catch (error) {
        console.error('Error handling member form submission:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    } finally {
        // Clean up the uploaded file from the server
        if (uploadedFile && fs.existsSync(uploadedFile.path)) {
            fs.unlinkSync(uploadedFile.path);
        }
    }
});

module.exports = router;
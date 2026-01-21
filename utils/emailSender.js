const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');
const nodemailer = require("nodemailer");

// Initialize Resend with API Key from env (if available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Configure Nodemailer transporter using Hostinger SMTP (Fallback)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_INFO,            // smtp.hostinger.com
  port: parseInt(process.env.SMTP_PORT_INFO),  // 465 (SSL) or 587 (TLS)
  secure: process.env.SMTP_SECURE_INFO === 'true', // true for SSL (465), false for TLS (587)
  auth: {
    user: process.env.EMAIL_USER_INFO,         // hello@peptides.co.in
    pass: process.env.EMAIL_PASS_INFO,         // mailbox password
  },
  tls: {
    rejectUnauthorized: false, // avoids certificate issues
  },
  connectionTimeout: 30000,     // 30s max before failing
});

/**
 * Sends an email with optional attachments.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @param {Array<Object>} attachments - Array of { filename, path } objects
 */
const sendEmail = async (to, subject, htmlContent, attachments = []) => {
  // 1. Try Resend API (Priority)
  if (process.env.RESEND_API_KEY) {
    try {
      console.log(`📤 Sending email to ${to} via Resend API...`);

      // Prepare Attachments for Resend
      const processedAttachments = [];
      if (attachments && attachments.length > 0) {
        for (const att of attachments) {
          if (att.path && fs.existsSync(att.path)) {
            const fileContent = fs.readFileSync(att.path); // Buffer for Resend
            processedAttachments.push({
              filename: att.filename,
              content: fileContent
            });
          }
        }
      }

      const data = await resend.emails.send({
        from: 'Peptides Knowledge Park <hello@peptides.co.in>', // Should match verified domain in Resend
        to: [to],
        subject: subject,
        html: htmlContent,
        attachments: processedAttachments.length > 0 ? processedAttachments : undefined
      });

      if (data.error) {
        throw new Error(data.error.message);
      }

      console.log(`✅ Email sent successfully to ${to} via Resend. ID: ${data.data.id}`);
      return data; // Success exit
    } catch (error) {
      console.error(`❌ Resend API failed, falling back to SMTP:`, error.message);
      // Fallthrough to SMTP
    }
  } else {
    console.warn("⚠️ RESEND_API_KEY is missing. Trying SMTP...");
  }

  // 2. Fallback to Nodemailer (SMTP)
  try {
    console.log(`📤 Sending email to ${to} via SMTP (Nodemailer)...`);
    const mailOptions = {
      from: `"Peptides Knowledge Park" <${process.env.EMAIL_USER_INFO || 'hello@peptides.co.in'}>`,
      to,
      subject,
      html: htmlContent,
      attachments: attachments, // Nodemailer handles path/content automatically
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to} via SMTP: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ All email methods failed for ${to}:`, error);
  }
};

/**
 * Verification function
 */
const verifyConnection = async () => {
  if (process.env.RESEND_API_KEY) {
    console.log("✅ Resend API Mode: Key detected.");
  } else {
    console.log("ℹ️ Resend API Mode: Key NOT detected. Will try SMTP.");
  }
  return true;
};

module.exports = { sendEmail, verifyConnection };

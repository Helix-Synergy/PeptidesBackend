const axios = require('axios');
const fs = require('fs');

/**
 * Sends an email using Brevo HTTP API
 * @param {string} to - Recipient email string
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @param {Array<Object>} attachments - Array of { filename, path } objects
 */
const sendEmail = async (to, subject, htmlContent, attachments = []) => {
  // 1. Check if API Key exists
  if (!process.env.BREVO_API_KEY) {
    console.warn("⚠️ BREVO_API_KEY is missing. Email skipped, but data is saved to DB.");
    return;
  }

  try {
    console.log(`📤 Sending email to ${to} via Brevo API...`);

    // 2. Prepare Attachments (Convert to Base64 content for API)
    const processedAttachments = [];
    if (attachments && attachments.length > 0) {
      for (const att of attachments) {
        if (att.path && fs.existsSync(att.path)) {
          const fileContent = fs.readFileSync(att.path).toString('base64');
          processedAttachments.push({
            name: att.filename,
            content: fileContent
          });
        }
      }
    }

    // 3. Make HTTP Request
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: "Peptides Knowledge Park", email: process.env.OWNER_EMAIL || "hello@peptides.co.in" },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
        attachment: processedAttachments.length > 0 ? processedAttachments : undefined
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        }
      }
    );

    console.log(`✅ Email sent successfully via API! MessageId: ${response.data.messageId}`);
    return response.data;

  } catch (error) {
    // Detailed error logging for API failures
    console.error("❌ Email API Error:", error.response ? error.response.data : error.message);
    throw error; // Let the route handler catch this
  }
};

/**
 * Empty verification function to keep server.js happy without crashing
 */
const verifyConnection = async () => {
  if (process.env.BREVO_API_KEY) {
    console.log("✅ Brevo API Mode: Key detected.");
  } else {
    console.log("ℹ️ Brevo API Mode: Key NOT detected. Emails will be skipped.");
  }
  return true;
};

module.exports = { sendEmail, verifyConnection };

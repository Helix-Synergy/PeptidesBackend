// const nodemailer = require("nodemailer");

// // Configure Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST, // smtp.hostinger.com
//   port: Number(process.env.EMAIL_PORT), // 465
//   secure: true, // SSL required for port 465
//   auth: {
//     user: process.env.EMAIL_USER, // hello@peptides.co.in
//     pass: process.env.EMAIL_PASS, // mailbox password
//   },
//   tls: {
//     rejectUnauthorized: false, // avoids Hostinger cert issues
//   },
//   connectionTimeout: 30000, // 10s max before failing
// });

// /**
//  * Sends an email with optional attachments.
//  * @param {string} to - Recipient email address.
//  * @param {string} subject - Email subject line.
//  * @param {string} htmlContent - HTML content of the email.
//  * @param {Array<Object>} attachments - An array of attachment objects.
//  */
// const sendEmail = async (to, subject, htmlContent, attachments = []) => {
//   try {
//     const mailOptions = {
//       from: `"Peptides Knowledge Park" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html: htmlContent,
//       attachments,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ Email sent successfully to ${to}: ${info.messageId}`);
//     return info;
//   } catch (error) {
//     console.error(`❌ Error sending email to ${to}:`, error);
//     throw error; // important so your route can respond with 500
//   }
// };

// module.exports = { sendEmail };



// emailsender.js
const nodemailer = require("nodemailer");

// Configure Nodemailer transporter using Hostinger SMTP
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

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

// Log the config being used (masking password)
console.log("📧 Configuring Nodemailer with:", {
  host: process.env.SMTP_HOST_INFO,
  port: process.env.SMTP_PORT_INFO,
  secure: process.env.SMTP_SECURE_INFO,
  user: process.env.EMAIL_USER_INFO,
});

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_INFO,            
  port: parseInt(process.env.SMTP_PORT_INFO),  
  secure: process.env.SMTP_SECURE_INFO === 'true', 
  auth: {
    user: process.env.EMAIL_USER_INFO,         
    pass: process.env.EMAIL_PASS_INFO,         
  },
  tls: {
    rejectUnauthorized: false, 
  },
  connectionTimeout: 10000, // Reduced to 10s for faster feedback
  debug: true, // Enable debug output
  logger: true // Log to console
});

/**
 * Verifies the SMTP connection.
 */
const verifyConnection = async () => {
    try {
        console.log("⏳ Verifying SMTP Connection...");
        await transporter.verify();
        console.log("✅ SMTP Connection established successfully!");
        return true;
    } catch (error) {
        console.error("❌ SMTP Connection Failed:", error);
        return false;
    }
};

/**
 * Sends an email with optional attachments.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @param {Array<Object>} attachments - Optional attachments
 */
const sendEmail = async (to, subject, htmlContent, attachments = []) => {
  try {
    const mailOptions = {
      from: `"Peptides Knowledge Park" <${process.env.EMAIL_USER_INFO}>`,
      to,
      subject,
      html: htmlContent,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
    throw error; // important so your route can respond with 500
  }
};

module.exports = { sendEmail, verifyConnection };

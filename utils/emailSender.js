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

module.exports = { sendEmail };

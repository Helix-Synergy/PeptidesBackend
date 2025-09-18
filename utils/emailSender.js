const nodemailer = require("nodemailer");

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g. smtp.hostinger.com
  port: Number(process.env.EMAIL_PORT), // ensure number
  secure: Number(process.env.EMAIL_PORT) === 465, // SSL if 465, STARTTLS otherwise
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // helps avoid Hostinger cert issues
  },
  connectionTimeout: 10000, // fail fast if can’t connect (10s)
});

/**
 * Sends an email with optional attachments.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject line.
 * @param {string} htmlContent - HTML content of the email.
 * @param {Array<Object>} attachments - An array of attachment objects.
 */
const sendEmail = async (to, subject, htmlContent, attachments = []) => {
  try {
    const mailOptions = {
      from: `"Peptides Knowledge Park" <${process.env.EMAIL_USER}>`,
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
    throw error; // Important: let routes handle failure
  }
};

module.exports = { sendEmail };

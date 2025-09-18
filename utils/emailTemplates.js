const ownerTemplate = (data, formName = 'Submission') => {
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>New ${formName} Submission</title>
            <style>
                body { font-family: sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
                h2 { color: #555; }
                ul { list-style: none; padding: 0; }
                li { margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                li strong { color: #000; display: inline-block; width: 150px; }
                .note { background-color: #f9f9f9; padding: 10px; border-left: 3px solid #0056b3; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>New ${formName} Submission</h2>
                <p>You have received a new submission with the following details:</p>
                <ul>
    `;

    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            if (typeof data[key] !== 'string' || data[key].length > 256) {
                continue;
            }
            let label = key.replace(/([A-Z])/g, ' $1').trim();
            label = label.charAt(0).toUpperCase() + label.slice(1);
            html += `<li><strong>${label}:</strong> ${data[key]}</li>`;
        }
    }

    html += `
                </ul>
                <div class="note">
                    <p>This message was automatically generated. Please respond to the sender directly if a follow-up is required.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    return html;
};

const confirmationTemplate = (name, formName = 'Submission') => {
    let message = '';
    let closing = '';

    switch (formName) {
        case 'Contact Form':
            message = `
                <p>Thank you for reaching out to us, ${name}!</p>
                <p>We have received your message and will get back to you within 24 to 48 hours.</p>
                <p>We appreciate your patience and look forward to speaking with you.</p>
            `;
            closing = `<p>Best Regards,<br>The Peptides Knowledge Park Team <br> Contact: 7997040959</p>`;
            break;
        case 'Student Registration':
            message = `
                <p>Thank you for your interest in our student program, ${name}!</p>
                <p>Your registration has been successfully submitted and is under review. Our team will contact you soon with the next steps.</p>
                <p>We are excited about your potential to join us.</p>
            `;
            closing = `<p>Best Regards,<br>The Peptides Knowledge Park Team <br> Contact: 7997040959</p>`;
            break;
        case 'Faculty Registration':
            message = `
                <p>We appreciate your interest in joining our faculty, ${name}!</p>
                <p>Your registration has been submitted and we will be in touch shortly to discuss your application.</p>
                <p>Our team will get back to you within 2-3 business days.</p>
            `;
            closing = `<p>Best Regards,<br>The Peptides Knowledge Park Team <br> Contact: 7997040959</p>`;
            break;
        case 'Become a Member':
            message = `
                <p>Welcome! Thank you for your interest in becoming a member, ${name}.</p>
                <p>We have received your application and our team will review it. You can expect to hear from us within 48 hours regarding the next steps.</p>
                <p>We are excited about the possibility of you joining our community.</p>
            `;
            closing = `<p>Best Regards,<br>The Peptides Knowledge Park Team <br> Contact: 7997040959</p>`;
            break;
        case 'Collaboration Form':
            message = `
                <p>Thank you for your collaboration proposal, ${name}!</p>
                <p>We have received your submission and our team will review it promptly. You should receive a response from us within 2-3 business days.</p>
                <p>We appreciate your interest in working with us.</p>
            `;
            closing = `<p>Best Regards,<br>The Peptides Knowledge Park Team <br> Contact: 7997040959</p>`;
            break;
        default:
            message = `
                <p>Thank you for your submission, ${name}.</p>
                <p>Our team will contact you shortly.</p>
            `;
            closing = `<p>Best Regards,<br>The Peptides Knowledge Park Team <br> Contact: 7997040959</p>`;
            break;
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Confirmation</title>
            <style>
                body { font-family: sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
                h2 { color: #555; }
                p { margin-bottom: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Thank You, ${name}!</h2>
                ${message}
                ${closing}
            </div>
        </body>
        </html>
    `;
};

module.exports = { ownerTemplate, confirmationTemplate };
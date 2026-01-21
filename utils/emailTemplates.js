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


const paymentReceiptTemplate = (paymentDetails) => {
    const {
        invoiceNo,
        date,
        recipientName,
        recipientAddress, // Optional, can be empty
        itemDescription,
        amount,
        paymentId
    } = paymentDetails;

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Payment Receipt</title>
            <style>
                body {
                    font-family: 'Times New Roman', Times, serif; /* Matching the formal look */
                    color: #000;
                    background-color: #fff;
                    margin: 0;
                    padding: 0;
                    line-height: 1.4;
                }
                .container {
                    max-width: 800px;
                    margin: 20px auto;
                    background: #fff;
                    padding: 40px;
                    border: 1px solid #ddd; /* Optional border for email view */
                }
                .header-top-bar {
                    height: 10px;
                    background-color: #8B6914; /* Brownish Gold color from image */
                    margin-bottom: 20px;
                }
                .header-logo-section {
                    display: table;
                    width: 100%;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 15px;
                }
                .logo-col {
                    display: table-cell;
                    width: 30%;
                    vertical-align: top;
                    text-align: left;
                }
                .logo-img {
                    max-width: 120px;
                    display: block;
                }
                .logo-text {
                    font-size: 18px;
                    font-weight: bold;
                    color: #8B6914;
                    margin-top: 5px;
                    letter-spacing: 1px;
                }
                .logo-subtext {
                    font-size: 10px;
                    text-transform: uppercase;
                    color: #555;
                }
                .company-info-col {
                    display: table-cell;
                    width: 70%;
                    vertical-align: top;
                    text-align: right;
                    font-size: 13px;
                }
                .company-info-item {
                    margin-bottom: 3px;
                    display: block;
                }
                .icon {
                    color: #8B6914;
                    margin-right: 5px;
                    font-weight: bold;
                }
                
                .bill-title {
                    text-align: center;
                    font-weight: bold;
                    text-decoration: underline;
                    margin: 20px 0;
                    font-size: 18px;
                    text-transform: uppercase;
                }

                .invoice-details {
                    width: 100%;
                    text-align: right;
                    margin-bottom: 20px;
                    font-weight: bold;
                    font-size: 14px;
                }

                .recipient-section {
                    margin-bottom: 30px;
                    font-size: 14px;
                }
                .recipient-label {
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .subject-line {
                    font-weight: bold;
                    margin-bottom: 15px;
                    font-size: 14px;
                }

                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                    font-size: 14px;
                }
                .items-table th {
                    background-color: #FFFF00; /* Yellow header from image */
                    border: 1px solid #000;
                    padding: 5px;
                    text-align: center;
                    font-weight: bold;
                }
                .items-table td {
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: center;
                }
                .items-table td.desc {
                    text-align: left;
                    padding-left: 10px;
                }
                .total-row td {
                    font-weight: bold;
                }

                .footer-sign {
                    margin-top: 50px;
                    font-size: 14px;
                }
                .footer-sign p {
                    margin: 2px 0;
                }
                
                .footer-bar {
                    height: 10px;
                    background-color: #8B6914;
                    margin-top: 40px;
                    /* Using clip-path to mimic the slant if supported, otherwise just a bar */
                }

            </style>
        </head>
        <body>
            <div class="container">
                <!-- Top Decorative Bar -->
                <div class="header-top-bar"></div>

                <!-- Header Section -->
                <div class="header-logo-section">
                    <div class="logo-col">
                        <!-- Ideally replace with hosted image URL -->
                        <img src="https://peptides.co.in/assets/img/logo.png" alt="Peptides Logo" class="logo-img" style="min-height:50px; background:#f0f0f0;"> 
                        <div class="logo-text">PEPTIDES</div>
                        <div class="logo-subtext">KNOWLEDGE PARK</div>
                    </div>
                    <div class="company-info-col">
                         <div class="company-info-item"><span class="icon">&#9990;</span> +91 7997 040 959</div>
                         <div class="company-info-item"><span class="icon">&#9993;</span> hello@peptides.co.in</div>
                         <div class="company-info-item"><span class="icon">&#127760;</span> www.peptides.co.in</div>
                         <div class="company-info-item" style="margin-top: 5px;">
                            <span class="icon">&#128205;</span> 402, 4th Floor Manjeera<br>
                            Trinity Corporate, KPHB<br>
                            Hyderabad - 500072
                         </div>
                    </div>
                </div>

                <div class="bill-title">Cash Bill</div>

                <div class="invoice-details">
                    <div>Date: ${date}</div>
                    <div style="margin-top: 5px;">Invoice No: ${invoiceNo}</div>
                </div>

                <div class="recipient-section">
                    <div class="recipient-label">To,</div>
                    <div style="margin-left: 0px; font-weight: bold;">${recipientName},</div>
                    <div style="margin-left: 0px;">${recipientAddress || ''}</div>
                </div>

                <div class="subject-line">
                    Sub: Bill for ${itemDescription}
                </div>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 10%;">S.No</th>
                            <th style="width: 50%;">Items</th>
                            <th style="width: 20%;">Qty</th>
                            <th style="width: 20%;">Price (INR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td class="desc">${itemDescription}</td>
                            <td>1</td>
                            <td>${amount}/-</td>
                        </tr>
                        <!-- Empty rows to match the look if desired, or simplified -->
                        <tr class="total-row">
                            <td colspan="3" style="text-align: right; padding-right: 15px;">Total</td>
                            <td>${amount}/-</td>
                        </tr>
                    </tbody>
                </table>

                 <div style="text-align: right; margin-bottom: 20px;">
                    <strong>Reference ID:</strong> ${paymentId}
                 </div>

                <div class="footer-sign">
                    <p style="font-weight: bold;">Dr. Suya Sarva</p>
                    <p>COO | Helix Synergy Corp</p>
                </div>

                <div class="footer-bar"></div>
            </div>
        </body>
        </html>
    `;
};

module.exports = { ownerTemplate, confirmationTemplate, paymentReceiptTemplate };
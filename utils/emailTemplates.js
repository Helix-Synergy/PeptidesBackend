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
        recipientAddress,
        itemDescription,
        amount,
        paymentId,
        record // Full record object
    } = paymentDetails;

    // Helper to safely get field
    const getField = (val) => val || '-';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Payment Receipt</title>
            <style>
                body {
                    font-family: 'Times New Roman', Times, serif;
                    color: #000;
                    background-color: #fff;
                    margin: 0;
                    padding: 0;
                    line-height: 1.4;
                    -webkit-print-color-adjust: exact;
                }
                .container {
                    max-width: 800px;
                    margin: 20px auto;
                    background: #fff;
                    padding: 40px;
                    border: 1px solid #ddd;
                }
                /* Print styles */
                @media print {
                    body { background-color: #fff; }
                    .container { margin: 0; padding: 20px; border: none; max-width: 100%; width: 100%; }
                    .no-print { display: none; }
                }
                
                .header-top-bar { height: 10px; background-color: #8B6914; margin-bottom: 20px; }
                .header-logo-section { display: table; width: 100%; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 15px; }
                .logo-col { display: table-cell; width: 30%; vertical-align: top; text-align: left; }
                .logo-text { font-size: 24px; font-weight: 900; color: #8B6914; letter-spacing: 1px; line-height: 1; }
                .logo-subtext { font-size: 11px; text-transform: uppercase; color: #555; letter-spacing: 2px; }
                
                .company-info-col { display: table-cell; width: 70%; vertical-align: top; text-align: right; font-size: 13px; }
                .company-info-item { margin-bottom: 3px; display: block; }
                .icon { color: #8B6914; margin-right: 5px; font-weight: bold; }
                
                .bill-title { text-align: center; font-weight: bold; text-decoration: underline; margin: 20px 0; font-size: 22px; text-transform: uppercase; }
                
                .metadata-table { width: 100%; margin-bottom: 25px; border-collapse: collapse; }
                .metadata-table td { vertical-align: top; padding: 5px 0; }
                .metadata-label { font-weight: bold; width: 120px; color: #444; }
                
                .section-header { background-color: #eee; padding: 8px 10px; font-weight: bold; border-left: 5px solid #8B6914; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
                
                .details-grid { display: table; width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
                .details-row { display: table-row; }
                .details-cell { display: table-cell; width: 50%; padding: 5px; border-bottom: 1px solid #f0f0f0; }
                .details-key { font-weight: bold; color: #555; display: inline-block; width: 120px; }
                
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; border: 1px solid #000; }
                .items-table th { background-color: #FFFF00; border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold; }
                .items-table td { border: 1px solid #000; padding: 10px; text-align: center; }
                .items-table td.desc { text-align: left; padding-left: 15px; }
                .total-row td { font-weight: bold; background-color: #f9f9f9; font-size: 16px; }
                
                .footer-sign { margin-top: 60px; font-size: 14px; text-align: right; margin-right: 20px; }
                .footer-bar { height: 10px; background-color: #8B6914; margin-top: 40px; }
                
                .print-tip { background-color: #e0f2fe; color: #0369a1; padding: 10px; text-align: center; font-size: 13px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #bae6fd; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="no-print print-tip">
                    🖨️ <strong>Tip:</strong> Click 'Print' and select 'Save as PDF' to download this receipt.
                </div>
                
                <div class="header-top-bar"></div>

                <div class="header-logo-section">
                    <div class="logo-col">
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

                <div class="bill-title">PAYMENT RECEIPT</div>

                <table class="metadata-table">
                    <tr>
                        <td style="width: 60%">
                            <div class="section-header" style="margin-top:0;">billed to</div>
                            <div style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">${recipientName}</div>
                            <div>${recipientAddress || ''}</div>
                            <div>${record?.email || ''}</div>
                            <div>${record?.phone || record?.mobile || ''}</div>
                        </td>
                        <td style="width: 40%; text-align: right;">
                             <div class="section-header" style="text-align: right; border-left: none; border-right: 5px solid #8B6914;">Receipt Details</div>
                             <table style="width: 100%; text-align: right;">
                                <tr>
                                    <td class="metadata-label">Invoice No:</td>
                                    <td><strong>${invoiceNo}</strong></td>
                                </tr>
                                <tr>
                                    <td class="metadata-label">Date:</td>
                                    <td>${date}</td>
                                </tr>
                                <tr>
                                    <td class="metadata-label">Payment ID:</td>
                                    <td style="font-family: monospace;">${paymentId}</td>
                                </tr>
                             </table>
                        </td>
                    </tr>
                </table>

                ${record ? `
                <div class="section-header">Candidate Details</div>
                <div class="details-grid">
                    <div class="details-row">
                        <div class="details-cell"><span class="details-key">College/Org:</span> ${getField(record.college || record.organization || record.university)}</div>
                        <div class="details-cell"><span class="details-key">Course/Dept:</span> ${getField(record.course || record.department || record.profession)}</div>
                    </div>
                    <div class="details-row">
                         <div class="details-cell"><span class="details-key">Gender:</span> ${getField(record.gender)}</div>
                         <div class="details-cell"><span class="details-key">State:</span> ${getField(record.state)}</div>
                    </div>
                     <div class="details-row">
                         <div class="details-cell"><span class="details-key">Service:</span> ${getField(record.services)}</div>
                         <div class="details-cell"><span class="details-key">Source:</span> ${getField(record.source)}</div>
                    </div>
                </div>
                ` : ''}

                <div class="section-header">Payment Details</div>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 10%;">#</th>
                            <th style="width: 60%;">Description</th>
                            <th style="width: 10%;">Qty</th>
                            <th style="width: 20%;">Amount (INR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td class="desc">${itemDescription}</td>
                            <td>1</td>
                            <td>${amount}/-</td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="3" style="text-align: right; padding-right: 15px;">TOTAL AMOUNT PAID</td>
                            <td>₹${amount}/-</td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer-sign">
                    <img src="" alt="" style="height: 40px; display: block; margin-left: auto; margin-bottom: 5px;"> <!-- Placeholder for signature if needed -->
                    <p style="font-weight: bold; font-size: 16px;">Dr. Suya Sarva</p>
                    <p style="color: #666;">COO | Helix Synergy Corp</p>
                </div>

                <div class="footer-bar"></div>
                <div style="text-align: center; font-size: 10px; color: #888; margin-top: 10px;">
                    This is a computer-generated receipt and does not require a physical signature.
                </div>
            </div>
        </body>
        </html>
    `;
};

module.exports = { ownerTemplate, confirmationTemplate, paymentReceiptTemplate };
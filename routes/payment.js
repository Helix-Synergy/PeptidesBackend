const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Student, Faculty } = require('../models/FormSchemas'); // Import models to update status if needed

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. Create Order
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        const options = {
            amount: amount * 100, // Amount in paise
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

// 2. Verify Payment
router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, formType, formId } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing payment details' });
        }

        // Generate signature to verify
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment Verification Successful

            // Optionally update the registration form status here if formId is provided
            // For now, we just return success, and the frontend will submit the form with payment details

            res.json({
                success: true,
                message: 'Payment verified successfully',
                data: {
                    razorpay_order_id,
                    razorpay_payment_id
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Verification failed', error: error.message });
    }
});

const { sendEmail } = require('../utils/emailSender'); // Import email sender
const { paymentReceiptTemplate } = require('../utils/emailTemplates'); // Import receipt template

// ... (existing imports)

// 4. Create Payment Link (Admin initiated)
router.post('/create-payment-link', async (req, res) => {
    try {
        const { type, formData, amount, source } = req.body; // type: 'student' or 'faculty'

        if (!amount || !formData || !formData.email) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const Model = type === 'student' ? Student : Faculty;

        // 1. Create Record in DB
        const newRecord = new Model({
            ...formData,
            amount,
            payment_status: 'PendingLink',
            source: source || 'Peptides'
        });
        await newRecord.save();

        // 2. Create Razorpay Payment Link
        const linkOptions = {
            amount: amount * 100,
            currency: "INR",
            accept_partial: false,
            description: `Registration Fee for ${type}`,
            customer: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.mobile || formData.phone
            },
            notify: {
                sms: true,
                email: true
            },
            reminder_enable: true,
            notes: {
                record_id: newRecord._id.toString(),
                type: type
            },
            callback_url: `${process.env.CLIENT_URL}/payment-success`, // Redirect here after payment
            callback_method: "get"
        };

        const paymentLink = await razorpay.paymentLink.create(linkOptions);

        // 3. Update Record with Link Details
        newRecord.razorpay_order_id = paymentLink.id; // Using order_id field to store link id for simplicity or add new field
        // Actually, let's use a specific field if schema allows, otherwise map to existing.
        // Schema has razorpay_order_id, razorpay_payment_id. 
        // We'll store link ID in razorpay_order_id for now to track unique ref.
        newRecord.paymentLinkId = paymentLink.id; // If we add this to schema it's better, but let's stick to existing or use mixed.
        // The schema doesn't have paymentLinkId. I will add it dynamically or use razorpay_order_id.
        // Let's use razorpay_order_id for the Link ID as it's a unique identifier string.
        newRecord.razorpay_order_id = paymentLink.id;
        newRecord.shortUrl = paymentLink.short_url; // We might need to save this to show in UI. 
        // Schema doesn't have shortUrl. I probably need to update schema or just return it to UI.
        // I will return it to UI. Saving it would require schema update which I can do if strictly needed.
        // Let's try to update the record with whatever fields we have.

        await newRecord.save();

        res.json({
            success: true,
            message: 'Payment Link Generated',
            short_url: paymentLink.short_url,
            paymentLinkId: paymentLink.id
        });

    } catch (error) {
        console.error('Error creating payment link:', error);
        res.status(500).json({ message: 'Failed to create link', error: error.message });
    }
});

// 5. Sync Payment Status (Admin initiated)
router.post('/sync-payment-status', async (req, res) => {
    try {
        const { paymentLinkId, type } = req.body;

        // If specific ID provided
        if (paymentLinkId) {
            const linkDetails = await razorpay.paymentLink.fetch(paymentLinkId);

            if (linkDetails.status === 'paid') {
                // Update DB
                // We need to find the record. We stored linkId in razorpay_order_id
                // We need to search both collections if type not known, or use type.
                // Find record in either Student or Faculty collection
                let record = null;
                let foundType = type;

                if (type) {
                    const Model = (type === 'student' || type === 'Student') ? Student : Faculty;
                    record = await Model.findOne({ razorpay_order_id: paymentLinkId });
                } else {
                    // Try Student first
                    record = await Student.findOne({ razorpay_order_id: paymentLinkId });
                    foundType = 'student';
                    if (!record) {
                        record = await Faculty.findOne({ razorpay_order_id: paymentLinkId });
                        foundType = 'faculty';
                    }
                }

                if (record && record.payment_status !== 'Paid') {
                    record.payment_status = 'Paid';
                    record.razorpay_payment_id = linkDetails.payments[0]?.payment_id; // Get actual payment ID
                    await record.save();

                    // Send Receipt Email
                    const receiptData = {
                        invoiceNo: `PKP${Date.now().toString().slice(-6)}`,
                        date: new Date().toLocaleDateString('en-IN'),
                        recipientName: `${record.firstName} ${record.lastName}`,
                        recipientAddress: record.address || '', // Assuming address field exists
                        itemDescription: `Registration Fee for ${type}`,
                        amount: record.amount,
                        paymentId: record.razorpay_payment_id
                    };
                    const emailContent = paymentReceiptTemplate(receiptData);

                    await sendEmail(record.email, "Payment Receipt - Peptides Knowledge Park", emailContent);

                    return res.json({ success: true, status: 'paid', message: 'Status updated to Paid' });
                }
            }
            return res.json({ success: true, status: linkDetails.status, message: 'Status synced' });
        }

        // Bulk Sync impl (optional)
        res.json({ success: true, message: 'Sync complete' });

    } catch (error) {
        console.error('Error syncing status:', error);
        res.status(500).json({ message: 'Sync failed', error: error.message });
    }
});

// 3. Get All Payments (For Admin) - Keeping existing logic but ensuring we see PendingLink too
// fetching from Students and Faculty collections where paymentStatus is Paid or exists
router.get('/all', async (req, res) => {
    try {
        // Fetch Students with payments or links
        const students = await Student.find({
            $or: [
                { razorpay_payment_id: { $exists: true } },
                { payment_status: { $in: ['Paid', 'PendingLink'] } }
            ]
        }).select('firstName lastName email phone amount razorpay_payment_id payment_status createdAt razorpay_order_id');

        // Fetch Faculty with payments or links
        const faculty = await Faculty.find({
            $or: [
                { razorpay_payment_id: { $exists: true } },
                { payment_status: { $in: ['Paid', 'PendingLink'] } }
            ]
        }).select('firstName lastName email phone amount razorpay_payment_id payment_status createdAt razorpay_order_id');

        // Combine and sort
        const payments = [
            ...students.map(s => ({ ...s.toObject(), type: 'student' })), // normalized type lower case
            ...faculty.map(f => ({ ...f.toObject(), type: 'faculty' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({ success: true, payments });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Error fetching payments', error: error.message });
    }
});
// 6. Razorpay Webhook Endpoint (For Production Automation)
router.post('/webhook', async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret';
        // Note: In production, strictly set RAZORPAY_WEBHOOK_SECRET in .env

        const shasum = crypto.createHmac('sha256', secret);
        // CRITICAL: Use rawBody if available (from server.js middleware) to ensure exact match
        // Fallback to JSON.stringify only if rawBody is missing
        const dataToVerify = req.rawBody ? req.rawBody : JSON.stringify(req.body);

        shasum.update(dataToVerify);
        const digest = shasum.digest('hex');

        // Signature Validation
        if (digest !== req.headers['x-razorpay-signature']) {
            console.warn('Webhook signature mismatch!');
            // In production, this mismatch is fatal.
            if (process.env.NODE_ENV === 'production') {
                return res.status(400).json({ message: 'Invalid signature' });
            }
        }

        const event = req.body.event;
        const payload = req.body.payload;

        if (event === 'payment_link.paid') {
            const paymentLink = payload.payment_link.entity;
            const linkId = paymentLink.id; // This corresponds to our razorpay_order_id

            // We need to determine type. We stored it in notes!
            const type = paymentLink.notes ? paymentLink.notes.type : null;

            if (type) {
                const Model = (type === 'student' || type === 'Student') ? Student : Faculty;
                const record = await Model.findOne({ razorpay_order_id: linkId });

                if (record && record.payment_status !== 'Paid') {
                    record.payment_status = 'Paid';
                    // paymentLink entity has an array of payments or reference to the latest payment
                    // but broadly we just need to mark it paid. 
                    // We can try to get the payment ID from the payload details if available
                    // payload.payment_link.entity does not always have payment_id directly, 
                    // but the event might be accompanied by payment.captured
                    // For simplicity, we mark Paid. 
                    // If we want exact payment ID, we might need to fetch it or look at 'payment' entity in payload if sent.

                    await record.save();

                    // Send Receipt Email
                    const receiptData = {
                        invoiceNo: `PKP${Date.now().toString().slice(-6)}`,
                        date: new Date().toLocaleDateString('en-IN'),
                        recipientName: `${record.firstName} ${record.lastName}`,
                        recipientAddress: record.address || '',
                        itemDescription: `Registration Fee for ${type}`,
                        amount: record.amount,
                        paymentId: payload.payment?.entity?.id || linkId, // Try to get actual payment ID if available in payload
                        record: record
                    };

                    const emailContent = paymentReceiptTemplate(receiptData);
                    await sendEmail(record.email, "Payment Receipt - Peptides Knowledge Park", emailContent);
                    console.log(`Webhook: Payment marked paid for ${type} ${record._id}`);
                }
            }
        }

        res.json({ status: 'ok' });

    } catch (error) {
        console.error('Webhook Error:', error);
        // Always return 200 to Razorpay to prevent retries on logic errors
        res.status(200).json({ status: 'error', message: error.message });
    }
});

module.exports = router;

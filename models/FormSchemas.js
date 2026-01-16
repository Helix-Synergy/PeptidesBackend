const mongoose = require('mongoose');

// 1. Contact Form Schema
const ContactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    name: String, // Fallback if single name field
    email: { type: String, required: true },
    phone: String,
    message: String,
    company: String,
    subject: String,
    source: { type: String, default: 'Peptides' },
    createdAt: { type: Date, default: Date.now }
});

// 2. Student Registration Schema
const StudentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    phone: String,
    // Academic Details
    qualification: String, // Legacy support
    university: String,    // Legacy support
    interests: String,     // Legacy support
    // New Fields from Frontend
    gender: String,
    address: String,
    state: String,
    country: String,
    college: String,
    course: String,
    areaOfInterest: String,
    services: String,
    howYouKnowAboutUs: String,
    comment: String,

    paymentScreenshot: String, // Path to file
    source: { type: String, default: 'Peptides' },
    createdAt: { type: Date, default: Date.now }
});

// 3. Faculty Registration Schema
const FacultySchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    phone: String,
    specialization: String, // Legacy
    experience: String,     // Legacy
    // New Fields
    gender: String,
    address: String,
    state: String,
    country: String,
    college: String,
    department: String,
    designation: String,
    services: String,
    howYouKnowAboutUs: String,
    comment: String,

    paymentScreenshot: String, // Path to file
    source: { type: String, default: 'Peptides' },
    createdAt: { type: Date, default: Date.now }
});

// 4. Member Registration Schema
const MemberSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    phone: String,
    profession: String, // Legacy
    organization: String, // Legacy

    // New Fields from Frontend
    affiliation: String,
    currentWorkingOrganization: String,
    totalYearsOfExperience: String,
    expertise1: String,
    expertise2: String,
    biography: String,

    profileImage: String, // Path to file
    source: { type: String, default: 'Peptides' },
    createdAt: { type: Date, default: Date.now }
});

// 5. Collaborate Schema
const CollaborateSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true },
    type: String, // e.g., 'Research', 'Funding'
    address: String, // Added missing field
    message: String,
    source: { type: String, default: 'Peptides' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = {
    Contact: mongoose.model('Contact', ContactSchema),
    Student: mongoose.model('Student', StudentSchema),
    Faculty: mongoose.model('Faculty', FacultySchema),
    Member: mongoose.model('Member', MemberSchema),
    Collaborate: mongoose.model('Collaborate', CollaborateSchema)
};

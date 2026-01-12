require('dotenv').config();
const { verifyConnection } = require('./utils/emailSender');

// Verify email connection on startup
verifyConnection();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import route handlers
const contactRoutes = require('./routes/contact');
const studentRoutes = require('./routes/studentRegistration');
const facultyRoutes = require('./routes/facultyRegistration');
const memberRoutes = require('./routes/becomeMember');
const collaborateRoute = require('./routes/collaborate');

const app = express();
const PORT = process.env.PORT || 5000;

// Create 'uploads' directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers for each form
app.use('/api/contact', contactRoutes);
app.use('/api/register-student', studentRoutes);
app.use('/api/register-faculty', facultyRoutes);
app.use('/api/become-member', memberRoutes);
app.use('/api', collaborateRoute);
app.get("/", (req, res) => res.send("Backend is alive!"));


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

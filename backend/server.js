const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getDb, saveDb } = require('./utils/jsonDb');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact', require('./routes/contact'));
app.use('/api/upload', require('./routes/upload'));

// Serve Uploaded Images Statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Seed Admin User on Startup (File-based DB)
const seedAdmin = async () => {
    try {
        const db = getDb();
        const adminExists = db.users.find(u => u.username === 'mehran');

        if (!adminExists) {
            console.log('🌱 Seeding admin user...');
            const hashedPassword = await bcrypt.hash('12345678', 10);
            const newAdmin = {
                id: 'admin_1',
                username: 'mehran',
                password: hashedPassword
            };
            db.users.push(newAdmin);
            saveDb(db);
            console.log('👤 Admin user "mehran" created automatically.');
        } else {
            console.log('👤 Admin user already exists.');
        }
    } catch (error) {
        console.error('Failed to seed admin:', error);
    }
};

// Start server (No Database Connection Req)
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await seedAdmin();
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 Using local JSON file database (No MongoDB required)`);
});

module.exports = app;

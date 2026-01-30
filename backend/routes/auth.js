const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb, saveDb } = require('../utils/jsonDb');

const router = express.Router();

// Register (Restricted to one admin user)
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = getDb();

        // Check if ANY user exists (Limit to 1 admin)
        if (db.users.length > 0) {
            return res.status(403).json({ message: 'Admin already exists. Registration execution.' });
        }

        const existingUser = db.users.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            id: Date.now().toString(),
            username,
            password: hashedPassword
        };

        db.users.push(newUser);
        saveDb(db);

        res.status(201).json({ message: 'Admin user created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = getDb();

        // Find user
        const user = db.users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Verify token
router.get('/verify', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ valid: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const db = getDb();
        const user = db.users.find(u => u.id === decoded.userId);

        if (!user) {
            return res.status(401).json({ valid: false });
        }

        res.json({ valid: true, user: { id: user.id, username: user.username } });
    } catch (error) {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;

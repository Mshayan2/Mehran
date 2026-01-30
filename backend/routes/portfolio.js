const express = require('express');
const { getDb, saveDb } = require('../utils/jsonDb');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get portfolio data (public)
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        res.json(db.portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update portfolio data (protected)
router.put('/', authMiddleware, async (req, res) => {
    try {
        const { hero, expertise, testimonials, projects, skills, certifications } = req.body;
        console.log("Received Update Request");
        if (certifications && certifications.length > 0) {
            console.log("First Cert Image:", certifications[0].image);
        } else {
            console.log("No certifications or empty array");
        }

        const db = getDb();

        db.portfolio = {
            hero,
            expertise,
            testimonials,
            projects,
            skills,
            certifications,
            updatedAt: Date.now()
        };

        saveDb(db);

        res.json({ message: 'Portfolio updated successfully', portfolio: db.portfolio });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

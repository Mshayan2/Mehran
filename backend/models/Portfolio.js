const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    hero: {
        badge: String,
        titleLine1: String,
        titleHighlight: String,
        description: String
    },
    expertise: [{
        id: Number,
        title: String,
        desc: String,
        points: [String]
    }],
    testimonials: [{
        id: Number,
        text: String,
        name: String,
        role: String
    }],
    projects: [{
        id: Number,
        title: String,
        category: String,
        desc: String,
        tech: [String],
        link: String
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);

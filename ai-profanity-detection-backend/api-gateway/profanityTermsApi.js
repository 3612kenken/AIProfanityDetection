const express = require('express');
const router = express.Router();
const { ProfanityTerms } = require('../db-schema-system/profanitySystemSchema');

// Simple API key middleware
function secureRoute(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY || '3612kenken3612';
    if (apiKey && apiKey === validApiKey) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// GET all terms
router.get('/', secureRoute, async (req, res) => {
    const terms = await ProfanityTerms.find({});
    res.json(terms);
});

// GET single term by ID
router.get('/:id', secureRoute, async (req, res) => {
    const term = await ProfanityTerms.findById(req.params.id);
    if (!term) return res.status(404).json({ error: 'Not found' });
    res.json(term);
});

// POST create new term
router.post('/', secureRoute, async (req, res) => {
    try {
        const term = new ProfanityTerms(req.body);
        await term.save();
        res.status(201).json(term);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT replace term
router.put('/:id', secureRoute, async (req, res) => {
    try {
        const term = await ProfanityTerms.findByIdAndUpdate(req.params.id, req.body, { new: true, overwrite: true, runValidators: true });
        if (!term) return res.status(404).json({ error: 'Not found' });
        res.json(term);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH update term
router.patch('/:id', secureRoute, async (req, res) => {
    try {
        const term = await ProfanityTerms.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!term) return res.status(404).json({ error: 'Not found' });
        res.json(term);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE term
router.delete('/:id', secureRoute, async (req, res) => {
    const term = await ProfanityTerms.findByIdAndDelete(req.params.id);
    if (!term) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true });
});

module.exports = router;

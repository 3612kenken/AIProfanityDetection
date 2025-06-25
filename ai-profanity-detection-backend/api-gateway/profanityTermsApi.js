const express = require('express');
const router = express.Router();
const { ProfanityTerms, ApiTokenRegistered } = require('../db-schema-system/profanitySystemSchema');
const bcrypt = require('bcrypt');

// Secure API key middleware with bcrypt and DB check
async function secureRoute(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY || 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';
    if (apiKey && apiKey === validApiKey) {
        // Allow if matches the static validApiKey
        return next();
    }
    if (!apiKey) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        // Find all approved tokens
        const tokens = await ApiTokenRegistered.find({ status: 'approved' });
        // Check if any token matches the provided apiKey
        for (const token of tokens) {
            if (token.api_token_hash && await bcrypt.compare(apiKey, token.api_token_hash)) {
                return next();
            }
        }
        return res.status(401).json({ error: 'Unauthorized' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
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

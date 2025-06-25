const express = require('express');
const router = express.Router();
const { ApiTokenRegistered } = require('../db-schema-system/profanitySystemSchema');

function secureRoute(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY || '3612kenken3612';
    if (apiKey && apiKey === validApiKey) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// GET all tokens
router.get('/', secureRoute, async (req, res) => {
    const tokens = await ApiTokenRegistered.find({});
    res.json(tokens);
});

// GET single token by ID
router.get('/:id', secureRoute, async (req, res) => {
    const token = await ApiTokenRegistered.findById(req.params.id);
    if (!token) return res.status(404).json({ error: 'Not found' });
    res.json(token);
});

// POST create new token
router.post('/', secureRoute, async (req, res) => {
    try {
        const token = new ApiTokenRegistered(req.body);
        await token.save();
        res.status(201).json(token);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT replace token
router.put('/:id', secureRoute, async (req, res) => {
    try {
        const token = await ApiTokenRegistered.findByIdAndUpdate(req.params.id, req.body, { new: true, overwrite: true, runValidators: true });
        if (!token) return res.status(404).json({ error: 'Not found' });
        res.json(token);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH update token
router.patch('/:id', secureRoute, async (req, res) => {
    try {
        const token = await ApiTokenRegistered.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!token) return res.status(404).json({ error: 'Not found' });
        res.json(token);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE token
router.delete('/:id', secureRoute, async (req, res) => {
    const token = await ApiTokenRegistered.findByIdAndDelete(req.params.id);
    if (!token) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { ApiTokenRenewal } = require('../db-schema-system/profanitySystemSchema');

function secureRoute(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// GET all renewals
router.get('/', secureRoute, async (req, res) => {
    const renewals = await ApiTokenRenewal.find({});
    res.json(renewals);
});

// GET single renewal by ID
router.get('/:id', secureRoute, async (req, res) => {
    const renewal = await ApiTokenRenewal.findById(req.params.id);
    if (!renewal) return res.status(404).json({ error: 'Not found' });
    res.json(renewal);
});

// POST create new renewal
router.post('/', secureRoute, async (req, res) => {
    try {
        const renewal = new ApiTokenRenewal(req.body);
        await renewal.save();
        res.status(201).json(renewal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT replace renewal
router.put('/:id', secureRoute, async (req, res) => {
    try {
        const renewal = await ApiTokenRenewal.findByIdAndUpdate(req.params.id, req.body, { new: true, overwrite: true, runValidators: true });
        if (!renewal) return res.status(404).json({ error: 'Not found' });
        res.json(renewal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH update renewal
router.patch('/:id', secureRoute, async (req, res) => {
    try {
        const renewal = await ApiTokenRenewal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!renewal) return res.status(404).json({ error: 'Not found' });
        res.json(renewal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE renewal
router.delete('/:id', secureRoute, async (req, res) => {
    const renewal = await ApiTokenRenewal.findByIdAndDelete(req.params.id);
    if (!renewal) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true });
});

module.exports = router;

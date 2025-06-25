const express = require('express');
const router = express.Router();
const { ApiTokenRenewal } = require('../db-schema-system/profanitySystemSchema');

function secureRoute(req, res, next) {
  const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY || 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';
    if (apiKey && apiKey === validApiKey) {
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

const express = require('express');
const router = express.Router();
const { ApiTokenRegistered } = require('../db-schema-system/profanitySystemSchema');
const bcrypt = require('bcrypt');

function secureRoute(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY || 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';
    if (apiKey && apiKey === validApiKey) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

function getStatusCode(status) {
    switch (status) {
        case 'approved': return '0001';
        case 'pending': return '0002';
        case 'revoked': return '0003';
        case 'renewal': return '0004';
        default: return '0000';
    }
}

function encrypt(text) {
    // Simple base64 encoding for demonstration (replace with real encryption if needed)
    return Buffer.from(text).toString('base64');
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
        const body = { ...req.body };
        if (body.api_token_hash) {
            body.api_token_hash = await bcrypt.hash(body.api_token_hash, 10);
        }
        // Save first to get the _id
        const token = new ApiTokenRegistered(body);
        await token.save();
        // Encrypt status as required
        if (body.status) {
            const statusCode = getStatusCode(body.status);
            const encryptedStatus = encrypt(token._id + body.api_token_hash + statusCode);
            token.status = encryptedStatus;
            await token.save();
        }
        res.status(201).json(token);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT replace token
router.put('/:id', secureRoute, async (req, res) => {
    try {
        const body = { ...req.body };
        if (body.api_token_hash) {
            body.api_token_hash = await bcrypt.hash(body.api_token_hash, 10);
        }
        let token = await ApiTokenRegistered.findByIdAndUpdate(req.params.id, body, { new: true, overwrite: true, runValidators: true });
        if (!token) return res.status(404).json({ error: 'Not found' });
        if (body.status) {
            const statusCode = getStatusCode(body.status);
            const encryptedStatus = encrypt(token._id + body.api_token_hash + statusCode);
            token.status = encryptedStatus;
            await token.save();
        }
        res.json(token);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH update token
router.patch('/:id', secureRoute, async (req, res) => {
    try {
        const body = { ...req.body };
        if (body.api_token_hash) {
            body.api_token_hash = await bcrypt.hash(body.api_token_hash, 10);
        }
        let token = await ApiTokenRegistered.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
        if (!token) return res.status(404).json({ error: 'Not found' });
        if (body.status) {
            const statusCode = getStatusCode(body.status);
            const encryptedStatus = encrypt(token._id + body.api_token_hash + statusCode);
            token.status = encryptedStatus;
            await token.save();
        }
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

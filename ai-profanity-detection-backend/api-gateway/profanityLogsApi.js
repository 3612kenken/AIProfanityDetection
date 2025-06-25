const express = require('express');
const router = express.Router();
const { ProfanityLogs } = require('../db-schema-system/profanitySystemSchema');

function secureRoute(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// GET all logs
router.get('/', secureRoute, async (req, res) => {
    const logs = await ProfanityLogs.find({});
    res.json(logs);
});

// GET single log by ID
router.get('/:id', secureRoute, async (req, res) => {
    const log = await ProfanityLogs.findById(req.params.id);
    if (!log) return res.status(404).json({ error: 'Not found' });
    res.json(log);
});

// POST create new log
router.post('/', secureRoute, async (req, res) => {
    try {
        const log = new ProfanityLogs(req.body);
        await log.save();
        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT replace log
router.put('/:id', secureRoute, async (req, res) => {
    try {
        const log = await ProfanityLogs.findByIdAndUpdate(req.params.id, req.body, { new: true, overwrite: true, runValidators: true });
        if (!log) return res.status(404).json({ error: 'Not found' });
        res.json(log);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH update log
router.patch('/:id', secureRoute, async (req, res) => {
    try {
        const log = await ProfanityLogs.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!log) return res.status(404).json({ error: 'Not found' });
        res.json(log);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE log
router.delete('/:id', secureRoute, async (req, res) => {
    const log = await ProfanityLogs.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true });
});

module.exports = router;

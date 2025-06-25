const express = require('express');
const router = express.Router();
const { Users } = require('../db-schema-system/profanitySystemSchema');

function secureRoute(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// GET all users
router.get('/', secureRoute, async (req, res) => {
    const users = await Users.find({});
    res.json(users);
});

// GET single user by ID
router.get('/:id', secureRoute, async (req, res) => {
    const user = await Users.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
});

// POST create new user
router.post('/', secureRoute, async (req, res) => {
    try {
        const user = new Users(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT replace user
router.put('/:id', secureRoute, async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, overwrite: true, runValidators: true });
        if (!user) return res.status(404).json({ error: 'Not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH update user
router.patch('/:id', secureRoute, async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ error: 'Not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE user
router.delete('/:id', secureRoute, async (req, res) => {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true });
});

module.exports = router;

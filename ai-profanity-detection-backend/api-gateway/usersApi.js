const express = require('express');
const router = express.Router();
const { Users } = require('../db-schema-system/profanitySystemSchema');

function secureRoute(req, res, next) {
    const apiKey = req.headers['x-api-key'];
     const validApiKey = process.env.API_KEY || 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';
    if (apiKey && apiKey === validApiKey) {
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

// Example usage (not part of your backend file):
// The following code is invalid here and will cause errors:
// Remove or comment out this block to avoid errors.

// If you want to generate a SHA512 hash for testing:
const crypto = require('crypto');
const apiBKey = crypto.createHash('sha512').update('36!2kenken3612').digest('hex');
console.log(apiBKey);
// Use apiBKey as the value for 'x-api-key' header in your client requests

  fetch('http://127.0.0.1:3000/api/users', {
    headers: { 'x-api-key': apiBKey }
  })
    .then(res => res.json())
    .then(console.log);

// process.env.API_KEY is a way to access the value of the environment variable named "API_KEY".
// For example, if you run your app with:
//    API_KEY=yourkey node index.js
// or have a .env file with:
//    API_KEY=yourkey
// then process.env.API_KEY will be 'yourkey'.


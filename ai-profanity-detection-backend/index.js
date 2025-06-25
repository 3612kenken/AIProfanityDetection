const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors'); // <-- add this line

const app = express();
app.use(cors()); // <-- add this line
app.use(express.json());

mongoose.connect('mongodb+srv://36123612:36123612@cluster0.aogurvh.mongodb.net/db_profanity_', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Mount APIs
app.use('/api/profanity-terms', require('./api-gateway/profanityTermsApi'));
app.use('/api/profanity-logs', require('./api-gateway/profanityLogsApi'));
app.use('/api/api-token-registered', require('./api-gateway/apiTokenRegisteredApi'));
app.use('/api/api-token-renewal', require('./api-gateway/apiTokenRenewalApi'));
app.use('/api/users', require('./api-gateway/usersApi'));

const { ProfanityLogs } = require('./db-schema-system/profanitySystemSchema');

// Word cloud endpoint
app.get('/api/wordcloud', async (req, res) => {
    try {
        const logs = await ProfanityLogs.find({}, 'detected_profanity').lean();
        const freq = {};
        logs.forEach(log => {
            if (log.detected_profanity) {
                log.detected_profanity.split(',').map(w => w.trim()).forEach(word => {
                    if (word) freq[word] = (freq[word] || 0) + 1;
                });
            }
        });
        res.json(freq);
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate word cloud' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

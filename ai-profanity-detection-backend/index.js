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
app.use('/api/identify-profanity', require('./api-gateway/apiIdentifyProfanity')); // <-- add this line

const { ProfanityLogs } = require('./db-schema-system/profanitySystemSchema');


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

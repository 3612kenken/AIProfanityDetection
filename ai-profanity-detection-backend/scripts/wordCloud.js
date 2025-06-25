const mongoose = require('mongoose');
const { ProfanityLogs } = require('../db-schema-system/profanitySystemSchema');

async function generateWordCloud() {
    await mongoose.connect('mongodb://localhost:27017/db_profanity_', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Fetch all detected_profanity entries
    const logs = await ProfanityLogs.find({}, 'detected_profanity').lean();

    // Count frequency of each detected_profanity (split by comma if needed)
    const freq = {};
    logs.forEach(log => {
        if (log.detected_profanity) {
            // Support comma-separated or single words
            log.detected_profanity.split(',').map(w => w.trim()).forEach(word => {
                if (word) freq[word] = (freq[word] || 0) + 1;
            });
        }
    });

    // Output as JSON (can be used for word cloud visualization)
    console.log(JSON.stringify(freq, null, 2));
    await mongoose.disconnect();
}

generateWordCloud().catch(err => {
    console.error(err);
    process.exit(1);
});

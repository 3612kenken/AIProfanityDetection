const express = require('express');
const router = express.Router();
const { ProfanityTerms, ProfanityLogs } = require('../db-schema-system/profanitySystemSchema');

function secureRoute(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY || 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';
    if (apiKey && apiKey === validApiKey) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// POST /api/identify-profanity
router.post('/', secureRoute, async (req, res) => {
    const { sentence, api_tr_id } = req.body;
    if (!sentence || typeof sentence !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid sentence' });
    }

    // Fetch all terms
    const terms = await ProfanityTerms.find({}, { term_tagalog: 1, term_english: 1, _id: 1 });

    // Build a list of all profanity words and their term IDs
    const profanityList = [];
    terms.forEach(term => {
        ['term_tagalog', 'term_english'].forEach(field => {
            if (term[field]) {
                term[field].split('/').map(w => w.trim().toLowerCase()).forEach(w => {
                    if (w) profanityList.push({ word: w, pt_id: term._id });
                });
            }
        });
    });

    // Find profanities in the sentence (substring match, case-insensitive)
    const lowerSentence = sentence.toLowerCase();
    const detected = [];
    const detectedDetails = [];
    profanityList.forEach(({ word, pt_id }) => {
        if (word && lowerSentence.includes(word) && !detected.includes(word)) {
            detected.push(word);
            detectedDetails.push({ word, pt_id });
        }
    });

    // If detected, save to ProfanityLogs
    let savedLogs = [];
    let changed_original = sentence;
    if (detectedDetails.length > 0 && api_tr_id) {
        // Mask all detected profanities in the sentence
        detectedDetails.forEach(({ word }) => {
            // Replace all occurrences (case-insensitive, word boundary optional)
            const mask = '*'.repeat(word.length);
            const regex = new RegExp(word, 'gi');
            changed_original = changed_original.replace(regex, mask);
        });

        // Save a log for each detected word
        for (const { word, pt_id } of detectedDetails) {
            const log = new ProfanityLogs({
                api_tr_id,
                original_value: sentence,
                detected_profanity: word,
                changed_original,
                pt_id,
                log_time: new Date()
            });
            await log.save();
            savedLogs.push(log);
        }
    }

    res.json({
        detected_profanities: detected,
        saved_logs: savedLogs.map(log => ({
            _id: log._id,
            api_tr_id: log.api_tr_id,
            original_value: log.original_value,
            detected_profanity: log.detected_profanity,
            changed_original: log.changed_original,
            pt_id: log.pt_id,
            log_time: log.log_time
        }))
    });
});

module.exports = router;

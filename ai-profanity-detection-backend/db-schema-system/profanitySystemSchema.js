const mongoose = require('mongoose');

// -----------------------------
// API Token Registered Schema
// -----------------------------

/*
const tokens = [
  'token1-Alice',
  'token2-Bob',
  'token3-Clara',
  'token4-David',
  'token5-Emily'
];
*/
const ApiTokenRegisteredSchema = new mongoose.Schema({
  full_name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 100 },
  phone_number: { type: String, maxlength: 20, default: null },
  api_token_hash: { type: String, maxlength: 255, unique: true, sparse: true },
  status: { type: String, enum: ['pending', 'approved', 'revoked'], default: 'pending', maxlength: 20 },
  registration_date: { type: Date, default: Date.now },
  expiration_date: { type: Date, required: true }
}, { collection: 'api_token_registered' }); 

const ApiTokenRegistered = mongoose.model('ApiTokenRegistered', ApiTokenRegisteredSchema);

// -----------------------------
// API Token Renewal Schema
// -----------------------------
const ApiTokenRenewalSchema = new mongoose.Schema({
  api_tr_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ApiTokenRegistered', required: true },
  registered_date: { type: Date, required: true },
  expired_date: { type: Date, required: true }
}, { collection: 'api_token_renewal' }); 

const ApiTokenRenewal = mongoose.model('ApiTokenRenewal', ApiTokenRenewalSchema);

// -----------------------------
// Profanity Terms Schema
// -----------------------------
const ProfanityTermsSchema = new mongoose.Schema({
  term_tagalog: { type: String, maxlength: 255, default: null },
  term_english: { type: String, required: true, maxlength: 50 },
  category: { type: String, maxlength: 100, default: null },
  meaning: { type: String, default: null },
  profanity_level: { type: Number, default: null }
}, { collection: 'profanity_terms' }); // <-- specify collection name

const ProfanityTerms = mongoose.model('ProfanityTerms', ProfanityTermsSchema);

// -----------------------------
// Profanity Logs Schema
// -----------------------------
const ProfanityLogsSchema = new mongoose.Schema({
  api_tr_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ApiTokenRegistered', required: true },
  original_value: { type: String, required: true },
  detected_profanity: { type: String, required: true },
  changed_original: { type: String, required: true },
  pt_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfanityTerms', required: true },
  recipient_public_ip: { type: String},
  recipient_email: { type: String},
  recipient_mac: { type: String},
  recipient_address: { type: String},
  log_time: { type: Date, default: Date.now }
}, { collection: 'profanity_logs' }); 

const ProfanityLogs = mongoose.model('ProfanityLogs', ProfanityLogsSchema);

// -----------------------------
// Users Schema
// -----------------------------
const UsersSchema = new mongoose.Schema({
  full_name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, maxlength: 100 },
  user_level: { type: String, required: true, maxlength: 50 },
  phone_number: { type: String, maxlength: 20, default: null },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'users' }); 

const Users = mongoose.model('Users', UsersSchema);

// -----------------------------
// Export Models
// -----------------------------
module.exports = {
  ApiTokenRegistered,
  ApiTokenRenewal,
  ProfanityTerms,
  ProfanityLogs,
  Users
};

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const FormData = require('form-data');

// Set up multer for file uploads
const upload = multer({
  dest: path.join(__dirname, '..', 'uploads'), // ensure uploads folder is inside your project
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit, adjust as needed
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// POST /api/voice-to-text
// Expects a multipart/form-data with an 'audio' file
router.post('/', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  try {
    // Debug: log file info
    console.log('Received file:', req.file);

    // Check file exists and is not empty
    if (!fs.existsSync(req.file.path) || fs.statSync(req.file.path).size === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Uploaded file is empty or missing' });
    }

    // Forward the audio file to the local transcription service
    const formData = new FormData();
    formData.append('audio', fs.createReadStream(req.file.path), {
      filename: req.file.originalname || 'audio.webm',
      contentType: req.file.mimetype
    });

    // Debug: log formData headers
    // console.log(formData.getHeaders());

    const response = await axios.post('http://localhost:5000/transcribe', formData, {
      headers: {
        ...formData.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Debug: log response from transcription service
    console.log('Transcription result:', response.data);

    // Log the actual text output from the transcription
    if (response.data && response.data.text) {
      console.log('Transcribed text:', response.data.text);
    } else {
      console.log('No transcribed text found in response.');
    }

    res.json({ text: response.data.text });
  } catch (err) {
    // Clean up file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Voice-to-text error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

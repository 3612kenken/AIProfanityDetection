// src/components/AudioTranscriber.js
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/voice-to-text';
const API_KEY = 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';

function AudioTranscriber() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTranscribe = async () => {
    if (!file) return alert('Please upload an audio file first.');

    const formData = new FormData();
    formData.append('audio', file);

    setLoading(true);
    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-api-key': API_KEY
        },
      });
      setText(response.data.text || 'No text found.');
    } catch (error) {
      console.error('Transcription failed:', error);
      setText('Error transcribing audio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎙️ Upload Audio for Transcription</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleTranscribe} disabled={loading}>
        {loading ? 'Transcribing...' : 'Transcribe'}
      </button>
      <br /><br />
      {text && (
        <div>
          <h3>📝 Transcribed Text:</h3>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default AudioTranscriber;
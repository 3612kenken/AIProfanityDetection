import React, { useState, useRef } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/voice-to-text';
const API_KEY = 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';

function LiveMicTranscriber() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new window.MediaRecorder(stream);
    let audioChunks = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      if (audioChunks.length > 0) {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');

        try {
          const res = await axios.post(API_URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'x-api-key': API_KEY
            },
          });
          if (res.data && typeof res.data.text === 'string' && res.data.text.trim() !== '') {
            setTranscript(res.data.text);
          }
        } catch (err) {
          console.error('❌ Transcription error:', err.message);
        }
      }
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">🎙️ Live Mic Transcription</h2>
          <button
            className={`btn ${recording ? 'btn-danger' : 'btn-primary'} mb-3`}
            onClick={recording ? stopRecording : startRecording}
          >
            {recording ? '🛑 Stop' : '🎤 Start Recording'}
          </button>
          <div className="mt-3">
            <h4>📝 Transcript:</h4>
            <div className="form-control" style={{ minHeight: 100, background: '#f8f9fa' }}>
              {transcript || <span className="text-muted">No transcript yet.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveMicTranscriber;
// (File did not exist before creation. Remove this file to rollback to before LiveMicTranscriber was created.)

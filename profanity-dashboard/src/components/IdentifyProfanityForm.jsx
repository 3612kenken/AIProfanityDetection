import React, { useState } from 'react';

const API_URL = 'http://localhost:3000/api/identify-profanity';
const API_KEY = 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';

export default function IdentifyProfanityForm() {
  const [sentence, setSentence] = useState('');
  const [apiTrId, setApiTrId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({ sentence, api_tr_id: apiTrId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Identify Profanity</h2>
          <form onSubmit={handleSubmit} className="row g-3 mb-4">
            <div className="col-md-8">
              <label className="form-label">Sentence</label>
              <input
                className="form-control"
                value={sentence}
                onChange={e => setSentence(e.target.value)}
                required
                placeholder="Enter a sentence to check for profanity"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">API Token Registered ID (ObjectId)</label>
              <input
                className="form-control"
                value={apiTrId}
                onChange={e => setApiTrId(e.target.value)}
                placeholder="(Optional) For logging"
              />
            </div>
            <div className="col-12 mt-2">
              <button type="submit" className="btn btn-primary">Check Profanity</button>
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </form>
          {result && (
            <div className="mt-3">
              <h5>Detected Profanities:</h5>
              {result.detected_profanities && result.detected_profanities.length > 0 ? (
                <ul>
                  {result.detected_profanities.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              ) : (
                <div className="text-success">No profanities detected.</div>
              )}
              {result.saved_logs && result.saved_logs.length > 0 && (
                <div className="mt-3">
                  <h6>Saved Logs:</h6>
                  <ul>
                    {result.saved_logs.map((log, i) => (
                      <li key={log._id}>
                        <strong>{log.detected_profanity}</strong> | Changed: <span className="text-muted">{log.changed_original}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

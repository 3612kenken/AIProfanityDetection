import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api/identify-profanity';
const API_KEY = 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';


export default function CommentSection() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [apiTrId] = useState('685c381864b2a066c6ca0a12');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [pendingInput, setPendingInput] = useState(null);

  // Move API call logic to useEffect, triggered by pendingInput
  useEffect(() => {
    if (pendingInput === null) return;
    const submitComment = async () => {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({ sentence: pendingInput, api_tr_id: apiTrId })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Error');
        setResult(data);

        // Defensive checks to avoid runtime errors if fields are undefined
        if (Array.isArray(data.detected_profanities) && data.detected_profanities.length > 0) {
          if (Array.isArray(data.saved_logs) && data.saved_logs.length > 0) {
            const log = data.saved_logs[0];
            const newComment = {
              text: log.changed_original,
              date: new Date()
            };
            setComments([newComment, ...comments]);
            setInput('');
          }
        } else {
          if (pendingInput.trim()) {
            setComments([{ text: pendingInput, date: new Date() }, ...comments]);
            setInput('');
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setPendingInput(null);
      }
    };
    submitComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingInput]);

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setResult(null);
    setPendingInput(input);
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Comments</h2>
          <form onSubmit={handleSubmit} className="mb-3">
            <div className="input-group">
              <input
                className="form-control"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Write a comment..."
              />
              <button className="btn btn-primary" type="submit">Post</button>
            </div>
          </form>
          <ul className="list-group">
            {comments.length === 0 && (
              <li className="list-group-item text-muted">No comments yet.</li>
            )}
            {comments.map((c, i) => (
              <li key={i} className="list-group-item">
                <div>{c.text}</div>
                <small className="text-muted">{c.date.toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

const API_URL = 'http://localhost:3000/api/identify-profanity';
const API_KEY = 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';


export default function CommentSection() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
 // const [sentence, setSentence] = useState('');
    const [apiTrId, setApiTrId] = useState('685c381864b2a066c6ca0a12');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
         //  result.detected_profanities && result.detected_profanities.length > 0 ?
        // setError('');
        // setResult(null);
        //setInput('Gago Ka na!');
        try {
            const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
            },
            body: JSON.stringify({ sentence: input, api_tr_id: apiTrId })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Error');
        setResult(data);

        // --- INCLUDE THIS LOGIC HERE ---
        if (data.detected_profanities.length > 0) {
          if (data.saved_logs.length > 0) {
            const newComments = data.saved_logs.map(log => ({
              text: log.changed_original,
              date: new Date()
            }));
            setComments([...newComments, ...comments]);
            setInput('');
          }
        } else {
          if (input.trim()) {
            setComments([{ text: input, date: new Date() }, ...comments]);
            setInput('');
          }
        }
        // --- END INCLUDE ---

      } catch (err) {
        setError(err.message);
      }

 
       

    //      if (input.trim()) {
    //   setComments([{ text: input, date: new Date() }, ...comments]);
    //   setInput('');
    // }
      
    
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

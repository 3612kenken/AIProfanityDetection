import React from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Profanity Dashboard</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Word Cloud</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profanity-logs">Profanity Logs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profanity-terms">Profanity Terms</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/api-token-registered">API Token Registered</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/api-token-renewal">API Token Renewal</Link>
            </li>
          
            <li className="nav-item">
              <Link className="nav-link" to="/users">Users</Link>
            </li>
              <li className="nav-item">
              <Link className="nav-link" to="/identify-profanity">Identify Profanity</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/comments">Comments</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

import React, { useEffect, useState, useRef } from 'react';

const API_URL = 'http://localhost:3000/api/profanity-logs';
const API_KEY = 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';

const initialForm = {
  api_tr_id: '',
  original_value: '',
  detected_profanity: '',
  changed_original: '',
  pt_id: '',
  log_time: ''
};

export default function ProfanityLogsForm() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const tableRef = useRef(null);

  // Fetch all logs
  const fetchLogs = () => {
    fetch(API_URL, { headers: { 'x-api-key': API_KEY } })
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        // Destroy DataTable if already initialized
        if (window.$ && window.$.fn.dataTable && tableRef.current && window.$.fn.dataTable.isDataTable(tableRef.current)) {
          window.$(tableRef.current).DataTable().destroy();
        }
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Initialize DataTable after logs are rendered
  useEffect(() => {
    if (logs.length > 0 && window.$ && window.$.fn.dataTable && tableRef.current) {
      window.$(tableRef.current).DataTable();
    }
  }, [logs]);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit (create or update)
  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(form)
    })
      .then(async res => {
        if (!res.ok) throw new Error((await res.json()).error || 'Error');
        setForm(initialForm);
        setEditingId(null);
        fetchLogs();
      })
      .catch(err => setError(err.message));
  };

  // Handle edit
  const handleEdit = log => {
    setForm({
      api_tr_id: log.api_tr_id,
      original_value: log.original_value,
      detected_profanity: log.detected_profanity,
      changed_original: log.changed_original,
      pt_id: log.pt_id,
      log_time: log.log_time ? log.log_time.slice(0, 16) : ''
    });
    setEditingId(log._id);
  };

  // Handle delete
  const handleDelete = id => {
    if (!window.confirm('Delete this log?')) return;
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': API_KEY }
    }).then(() => fetchLogs());
  };

  // Handle cancel edit
  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setError('');
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{editingId ? 'Edit Profanity Log' : 'Add Profanity Log'}</h2>
          <form onSubmit={handleSubmit} className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label">API Token ID</label>
              <input name="api_tr_id" value={form.api_tr_id} onChange={handleChange} required className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Original Value</label>
              <input name="original_value" value={form.original_value} onChange={handleChange} required className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Detected Profanity</label>
              <input name="detected_profanity" value={form.detected_profanity} onChange={handleChange} required className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Changed Original</label>
              <input name="changed_original" value={form.changed_original} onChange={handleChange} required className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Profanity Term ID</label>
              <input name="pt_id" value={form.pt_id} onChange={handleChange} required className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Log Time</label>
              <input type="datetime-local" name="log_time" value={form.log_time} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-12 mt-2">
              <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'}</button>
              {editingId && <button type="button" onClick={handleCancel} className="btn btn-secondary ms-2">Cancel</button>}
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </form>
        </div>
      </div>
      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          <h3 className="card-title">Profanity Logs</h3>
          <div className="table-responsive">
            <table ref={tableRef} className="table table-bordered table-hover align-middle table-striped" id="profanityLogsTable">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>API Token ID</th>
                  <th>Original Value</th>
                  <th>Detected Profanity</th>
                  <th>Changed Original</th>
                  <th>Profanity Term ID</th>
                  <th>Log Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id}>
                    <td>{log._id}</td>
                    <td>{log.api_tr_id}</td>
                    <td>{log.original_value}</td>
                    <td>{log.detected_profanity}</td>
                    <td>{log.changed_original}</td>
                    <td>{log.pt_id}</td>
                    <td>{log.log_time ? new Date(log.log_time).toLocaleString() : ''}</td>
                    <td>
                      <button onClick={() => handleEdit(log)} className="btn btn-sm btn-warning me-2">Edit</button>
                      <button onClick={() => handleDelete(log._id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-muted">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

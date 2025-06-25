import React, { useEffect, useState, useRef } from 'react';

const API_URL = 'http://localhost:3000/api/api-token-registered';
const API_KEY = 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';

const initialForm = {
  full_name: '',
  email: '',
  phone_number: '',
  api_token_hash: '',
  status: 'pending',
  registration_date: '',
  expiration_date: ''
};

export default function ApiTokenRegisteredForm() {
  const [tokens, setTokens] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const tableRef = useRef(null);

  const fetchTokens = () => {
    fetch(API_URL, { headers: { 'x-api-key': API_KEY } })
      .then(res => res.json())
      .then(data => {
        setTokens(data);
        // Destroy DataTable if already initialized
        if (window.$ && window.$.fn.dataTable && tableRef.current && window.$.fn.dataTable.isDataTable(tableRef.current)) {
          window.$(tableRef.current).DataTable().destroy();
        }
      });
  };

  useEffect(() => { fetchTokens(); }, []);

  useEffect(() => {
    if (tokens.length > 0 && window.$ && window.$.fn.dataTable && tableRef.current) {
      window.$(tableRef.current).DataTable();
    }
  }, [tokens]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify(form)
    })
      .then(async res => {
        if (!res.ok) throw new Error((await res.json()).error || 'Error');
        setForm(initialForm);
        setEditingId(null);
        fetchTokens();
      })
      .catch(err => setError(err.message));
  };

  const handleEdit = token => {
    setForm({
      full_name: token.full_name || '',
      email: token.email || '',
      phone_number: token.phone_number || '',
      api_token_hash: token.api_token_hash || '',
      status: token.status || 'pending',
      registration_date: token.registration_date ? token.registration_date.slice(0, 16) : '',
      expiration_date: token.expiration_date ? token.expiration_date.slice(0, 16) : ''
    });
    setEditingId(token._id);
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this token?')) return;
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': API_KEY }
    }).then(() => fetchTokens());
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setError('');
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{editingId ? 'Edit API Token Registered' : 'Add API Token Registered'}</h2>
          <form onSubmit={handleSubmit} className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label">Full Name</label>
              <input name="full_name" value={form.full_name} onChange={handleChange} required className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Email</label>
              <input name="email" value={form.email} onChange={handleChange} required className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Phone Number</label>
              <input name="phone_number" value={form.phone_number} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">API Token Hash</label>
              <input name="api_token_hash" value={form.api_token_hash} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="form-select">
                <option value="pending">pending</option>
                <option value="approved">approved</option>
                <option value="revoked">revoked</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Registration Date</label>
              <input type="datetime-local" name="registration_date" value={form.registration_date} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Expiration Date</label>
              <input type="datetime-local" name="expiration_date" value={form.expiration_date} onChange={handleChange} required className="form-control" />
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
          <h3 className="card-title">API Token Registered</h3>
          <div className="table-responsive">
            <table ref={tableRef} className="table table-bordered table-hover align-middle" id="apiTokenRegisteredTable">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>API Token Hash</th>
                  <th>Status</th>
                  <th>Registration Date</th>
                  <th>Expiration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map(token => (
                  <tr key={token._id}>
                    <td>{token._id}</td>
                    <td>{token.full_name}</td>
                    <td>{token.email}</td>
                    <td>{token.phone_number}</td>
                    <td>{token.api_token_hash}</td>
                    <td>{token.status}</td>
                    <td>{token.registration_date ? new Date(token.registration_date).toLocaleString() : ''}</td>
                    <td>{token.expiration_date ? new Date(token.expiration_date).toLocaleString() : ''}</td>
                    <td>
                      <button onClick={() => handleEdit(token)} className="btn btn-sm btn-warning me-2">Edit</button>
                      <button onClick={() => handleDelete(token._id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
                {tokens.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-muted">No records found.</td>
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

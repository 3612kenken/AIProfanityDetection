import React, { useEffect, useState, useRef } from 'react';

const API_URL = 'http://localhost:3000/api/api-token-renewal';
const API_KEY = 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';

const initialForm = {
  api_tr_id: '',
  registered_date: '',
  expired_date: ''
};

export default function ApiTokenRenewalForm() {
  const [renewals, setRenewals] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const tableRef = useRef(null);

  const fetchRenewals = () => {
    fetch(API_URL, { headers: { 'x-api-key': API_KEY } })
      .then(res => res.json())
      .then(data => {
        setRenewals(data);
        // Destroy DataTable if already initialized
        if (window.$ && window.$.fn.dataTable && tableRef.current && window.$.fn.dataTable.isDataTable(tableRef.current)) {
          window.$(tableRef.current).DataTable().destroy();
        }
      });
  };

  useEffect(() => { fetchRenewals(); }, []);

  useEffect(() => {
    if (renewals.length > 0 && window.$ && window.$.fn.dataTable && tableRef.current) {
      window.$(tableRef.current).DataTable();
    }
  }, [renewals]);

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
        fetchRenewals();
      })
      .catch(err => setError(err.message));
  };

  const handleEdit = renewal => {
    setForm({
      api_tr_id: renewal.api_tr_id || '',
      registered_date: renewal.registered_date ? renewal.registered_date.slice(0, 16) : '',
      expired_date: renewal.expired_date ? renewal.expired_date.slice(0, 16) : ''
    });
    setEditingId(renewal._id);
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this renewal?')) return;
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': API_KEY }
    }).then(() => fetchRenewals());
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
          <h2 className="card-title">{editingId ? 'Edit API Token Renewal' : 'Add API Token Renewal'}</h2>
          <form onSubmit={handleSubmit} className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label">API Token Registered ID</label>
              <input name="api_tr_id" value={form.api_tr_id} onChange={handleChange} required className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Registered Date</label>
              <input type="datetime-local" name="registered_date" value={form.registered_date} onChange={handleChange} required className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Expired Date</label>
              <input type="datetime-local" name="expired_date" value={form.expired_date} onChange={handleChange} required className="form-control" />
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
          <h3 className="card-title">API Token Renewals</h3>
          <div className="table-responsive">
            <table ref={tableRef} className="table table-bordered table-hover align-middle" id="apiTokenRenewalTable">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>API Token Registered ID</th>
                  <th>Registered Date</th>
                  <th>Expired Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {renewals.map(renewal => (
                  <tr key={renewal._id}>
                    <td>{renewal._id}</td>
                    <td>{renewal.api_tr_id}</td>
                    <td>{renewal.registered_date ? new Date(renewal.registered_date).toLocaleString() : ''}</td>
                    <td>{renewal.expired_date ? new Date(renewal.expired_date).toLocaleString() : ''}</td>
                    <td>
                      <button onClick={() => handleEdit(renewal)} className="btn btn-sm btn-warning me-2">Edit</button>
                      <button onClick={() => handleDelete(renewal._id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
                {renewals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">No records found.</td>
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

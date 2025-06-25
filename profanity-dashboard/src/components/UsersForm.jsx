import React, { useEffect, useState, useRef } from 'react';

const API_URL = 'http://localhost:3000/api/users';
const API_KEY = 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';

const initialForm = {
  full_name: '',
  email: '',
  user_level: '',
  phone_number: '',
  password_hash: '',
  created_at: '',
  updated_at: ''
};

export default function UsersForm() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const tableRef = useRef(null);

  const fetchUsers = () => {
    fetch(API_URL, { headers: { 'x-api-key': API_KEY } })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        // Destroy DataTable if already initialized
        if (window.$ && window.$.fn.dataTable && tableRef.current && window.$.fn.dataTable.isDataTable(tableRef.current)) {
          window.$(tableRef.current).DataTable().destroy();
        }
      });
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (users.length > 0 && window.$ && window.$.fn.dataTable && tableRef.current) {
      window.$(tableRef.current).DataTable();
    }
  }, [users]);

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
        fetchUsers();
      })
      .catch(err => setError(err.message));
  };

  const handleEdit = user => {
    setForm({
      full_name: user.full_name || '',
      email: user.email || '',
      user_level: user.user_level || '',
      phone_number: user.phone_number || '',
      password_hash: user.password_hash || '',
      created_at: user.created_at ? user.created_at.slice(0, 16) : '',
      updated_at: user.updated_at ? user.updated_at.slice(0, 16) : ''
    });
    setEditingId(user._id);
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this user?')) return;
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': API_KEY }
    }).then(() => fetchUsers());
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
          <h2 className="card-title">{editingId ? 'Edit User' : 'Add User'}</h2>
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
              <label className="form-label">User Level</label>
              <input name="user_level" value={form.user_level} onChange={handleChange} required className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Phone Number</label>
              <input name="phone_number" value={form.phone_number} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Password Hash</label>
              <input name="password_hash" value={form.password_hash} onChange={handleChange} required className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Created At</label>
              <input type="datetime-local" name="created_at" value={form.created_at} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Updated At</label>
              <input type="datetime-local" name="updated_at" value={form.updated_at} onChange={handleChange} className="form-control" />
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
          <h3 className="card-title">Users</h3>
          <div className="table-responsive">
            <table ref={tableRef} className="table table-bordered table-hover align-middle" id="usersTable">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>User Level</th>
                  <th>Phone Number</th>
                  <th>Password Hash</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.user_level}</td>
                    <td>{user.phone_number}</td>
                    <td>{user.password_hash}</td>
                    <td>{user.created_at ? new Date(user.created_at).toLocaleString() : ''}</td>
                    <td>{user.updated_at ? new Date(user.updated_at).toLocaleString() : ''}</td>
                    <td>
                      <button onClick={() => handleEdit(user)} className="btn btn-sm btn-warning me-2">Edit</button>
                      <button onClick={() => handleDelete(user._id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
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

import React, { useEffect, useState, useRef } from 'react';

const API_URL = 'http://localhost:3000/api/profanity-terms';
const API_KEY = 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';

const initialForm = {
  term_tagalog: '',
  term_english: '',
  category: '',
  meaning: '',
  profanity_level: ''
};

export default function ProfanityTermsForm() {
  const [terms, setTerms] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const tableRef = useRef(null);

  const fetchTerms = () => {
    fetch(API_URL, { headers: { 'x-api-key': API_KEY } })
      .then(res => res.json())
      .then(data => {
        setTerms(data);
        // Destroy DataTable if already initialized
        if (window.$ && window.$.fn.dataTable && tableRef.current && window.$.fn.dataTable.isDataTable(tableRef.current)) {
          window.$(tableRef.current).DataTable().destroy();
        }
      });
  };

  useEffect(() => { fetchTerms(); }, []);

  useEffect(() => {
    if (terms.length > 0 && window.$ && window.$.fn.dataTable && tableRef.current) {
      window.$(tableRef.current).DataTable();
    }
  }, [terms]);

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
        fetchTerms();
      })
      .catch(err => setError(err.message));
  };

  const handleEdit = term => {
    setForm({
      term_tagalog: term.term_tagalog || '',
      term_english: term.term_english || '',
      category: term.category || '',
      meaning: term.meaning || '',
      profanity_level: term.profanity_level || ''
    });
    setEditingId(term._id);
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this term?')) return;
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': API_KEY }
    }).then(() => fetchTerms());
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
          <h2 className="card-title">{editingId ? 'Edit Profanity Term' : 'Add Profanity Term'}</h2>
          <form onSubmit={handleSubmit} className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label">Tagalog</label>
              <input name="term_tagalog" value={form.term_tagalog} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">English</label>
              <input name="term_english" value={form.term_english} onChange={handleChange} required className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Category</label>
              <input name="category" value={form.category} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Meaning</label>
              <input name="meaning" value={form.meaning} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Profanity Level</label>
              <input name="profanity_level" value={form.profanity_level} onChange={handleChange} type="number" className="form-control" />
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
          <h3 className="card-title">Profanity Terms</h3>
          <div className="table-responsive">
            <table ref={tableRef} className="table table-bordered table-hover align-middle" id="profanityTermsTable">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Tagalog</th>
                  <th>English</th>
                  <th>Category</th>
                  <th>Meaning</th>
                  <th>Profanity Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {terms.map(term => (
                  <tr key={term._id}>
                    <td>{term._id}</td>
                    <td>{term.term_tagalog}</td>
                    <td>{term.term_english}</td>
                    <td>{term.category}</td>
                    <td>{term.meaning}</td>
                    <td>{term.profanity_level}</td>
                    <td>
                      <button onClick={() => handleEdit(term)} className="btn btn-sm btn-warning me-2">Edit</button>
                      <button onClick={() => handleDelete(term._id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
                {terms.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">No records found.</td>
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

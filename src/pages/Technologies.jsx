import React, { useState, useEffect } from 'react';
import { technologiesAPI } from '../services/api';
import { ConfirmModal, LoadingSpinner, AlertMessage, EmptyState } from '../components/Common';
import TechnologyModal from '../components/TechnologyModal';

export default function Technologies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await technologiesAPI.getAll();
      setItems(res.data);
    } catch {
      setAlert({ type: 'danger', message: 'Failed to fetch technologies' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (data) => {
    try {
      if (selected) {
        await technologiesAPI.update(selected.techId, { ...data, updatedBy: data.createdBy });
        setAlert({ type: 'success', message: 'Technology updated' });
      } else {
        await technologiesAPI.create(data);
        setAlert({ type: 'success', message: 'Technology created' });
      }
      setShowModal(false);
      fetchItems();
    } catch {
      setAlert({ type: 'danger', message: 'Failed to save technology' });
    }
  };

  const confirmDelete = async () => {
    try {
      await technologiesAPI.delete(selected.techId);
      setAlert({ type: 'success', message: 'Technology deleted' });
      setShowDelete(false);
      fetchItems();
    } catch {
      setAlert({ type: 'danger', message: 'Failed to delete technology' });
    }
  };

  const filtered = items.filter((t) =>
    t.techName?.toLowerCase().includes(search.toLowerCase()) ||
    t.techDescription?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container cj-page py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 cj-section-title mb-0"><i className="bi bi-cpu text-gradient me-2"></i>Technologies</h1>
        <button className="btn btn-brand" onClick={() => { setSelected(null); setShowModal(true); }}>
          <i className="bi bi-plus-circle me-2"></i>Add Technology
        </button>
      </div>

      {alert && <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <input className="form-control mb-4" placeholder="Search technologies..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon="cpu" title="No Technologies" message="Add your first technology." />
      ) : (
        <div className="row g-3">
          {filtered.map((t) => (
            <div className="col-md-6 col-lg-4" key={t.techId}>
              <div className="cj-card p-4 h-100 d-flex flex-column">
                <h5 className="fw-bold"><i className="bi bi-cpu text-gradient me-2"></i>{t.techName}</h5>
                <p className="text-muted small flex-grow-1">{t.techDescription || 'No description'}</p>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-brand flex-grow-1" onClick={() => { setSelected(t); setShowModal(true); }}>
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => { setSelected(t); setShowDelete(true); }}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TechnologyModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} technology={selected} />
      <ConfirmModal show={showDelete} title="Delete Technology"
        message={`Delete "${selected?.techName}"?`} onConfirm={confirmDelete} onCancel={() => setShowDelete(false)} />
    </div>
  );
}

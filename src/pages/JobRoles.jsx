import React, { useState, useEffect } from 'react';
import { jobRolesAPI } from '../services/api';
import { ConfirmModal, LoadingSpinner, AlertMessage, EmptyState } from '../components/Common';
import JobRoleModal from '../components/JobRoleModal';

export default function JobRoles() {
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
      const res = await jobRolesAPI.getAll();
      setItems(res.data);
    } catch {
      setAlert({ type: 'danger', message: 'Failed to fetch job roles' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (data) => {
    try {
      if (selected) {
        await jobRolesAPI.update(selected.roleId, { ...data, updatedBy: data.createdBy });
        setAlert({ type: 'success', message: 'Job role updated' });
      } else {
        await jobRolesAPI.create(data);
        setAlert({ type: 'success', message: 'Job role created' });
      }
      setShowModal(false);
      fetchItems();
    } catch {
      setAlert({ type: 'danger', message: 'Failed to save job role' });
    }
  };

  const confirmDelete = async () => {
    try {
      await jobRolesAPI.delete(selected.roleId);
      setAlert({ type: 'success', message: 'Job role deleted' });
      setShowDelete(false);
      fetchItems();
    } catch {
      setAlert({ type: 'danger', message: 'Failed to delete job role' });
    }
  };

  const filtered = items.filter((r) =>
    r.roleName?.toLowerCase().includes(search.toLowerCase()) ||
    r.roleDescription?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container cj-page py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 cj-section-title mb-0"><i className="bi bi-briefcase text-gradient me-2"></i>Job Roles</h1>
        <button className="btn btn-brand" onClick={() => { setSelected(null); setShowModal(true); }}>
          <i className="bi bi-plus-circle me-2"></i>Add Job Role
        </button>
      </div>

      {alert && <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <input className="form-control mb-4" placeholder="Search job roles..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon="briefcase" title="No Job Roles" message="Add your first job role." />
      ) : (
        <div className="row g-3">
          {filtered.map((r) => (
            <div className="col-md-6 col-lg-4" key={r.roleId}>
              <div className="cj-card p-4 h-100 d-flex flex-column">
                <h5 className="fw-bold"><i className="bi bi-briefcase text-gradient me-2"></i>{r.roleName}</h5>
                <p className="text-muted small flex-grow-1">{r.roleDescription || 'No description'}</p>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-brand flex-grow-1" onClick={() => { setSelected(r); setShowModal(true); }}>
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => { setSelected(r); setShowDelete(true); }}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <JobRoleModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} role={selected} />
      <ConfirmModal show={showDelete} title="Delete Job Role"
        message={`Delete "${selected?.roleName}"?`} onConfirm={confirmDelete} onCancel={() => setShowDelete(false)} />
    </div>
  );
}

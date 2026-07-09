import React, { useState, useEffect } from 'react';

export default function TechnologyModal({ show, onClose, onSave, technology }) {
  const [formData, setFormData] = useState({ techName: '', techDescription: '', createdBy: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (technology) {
      setFormData({
        techName: technology.techName || '',
        techDescription: technology.techDescription || '',
        createdBy: technology.createdBy || '',
      });
    } else {
      setFormData({ techName: '', techDescription: '', createdBy: '' });
    }
    setErrors({});
  }, [technology, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.techName.trim()) newErrors.techName = 'Technology name is required';
    if (!formData.createdBy.trim()) newErrors.createdBy = 'Created by is required';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(15,17,30,0.55)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0" style={{ borderRadius: '18px' }}>
          <div className="modal-header bg-brand-grad text-white" style={{ borderRadius: '18px 18px 0 0' }}>
            <h5 className="modal-title"><i className="bi bi-cpu me-2"></i>{technology ? 'Edit Technology' : 'Add Technology'}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Technology Name <span className="text-danger">*</span></label>
                <input type="text" className={`form-control ${errors.techName ? 'is-invalid' : ''}`}
                  name="techName" value={formData.techName} onChange={handleChange} placeholder="e.g. TypeScript" />
                {errors.techName && <div className="invalid-feedback d-block">{errors.techName}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" name="techDescription" rows="3"
                  value={formData.techDescription} onChange={handleChange} placeholder="Short description" />
              </div>
              <div className="mb-3">
                <label className="form-label">Created By <span className="text-danger">*</span></label>
                <input type="text" className={`form-control ${errors.createdBy ? 'is-invalid' : ''}`}
                  name="createdBy" value={formData.createdBy} onChange={handleChange} placeholder="Your name" />
                {errors.createdBy && <div className="invalid-feedback d-block">{errors.createdBy}</div>}
              </div>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-brand px-4"><i className="bi bi-check-circle me-2"></i>Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

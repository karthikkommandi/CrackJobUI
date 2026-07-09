import React, { useState, useEffect } from 'react';

export default function CompanyModal({ show, onClose, onSave, company }) {
  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    createdBy: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || '',
        companyDescription: company.companyDescription || '',
        createdBy: company.createdBy || '',
      });
    } else {
      setFormData({
        companyName: '',
        companyDescription: '',
        createdBy: '',
      });
    }
    setErrors({});
  }, [company, show]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.companyDescription.trim())
      newErrors.companyDescription = 'Description is required';
    if (!formData.createdBy.trim()) newErrors.createdBy = 'Created by is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
      setFormData({
        companyName: '',
        companyDescription: '',
        createdBy: '',
      });
    } else {
      setErrors(newErrors);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title">
              <i className="bi bi-building me-2"></i>
              {company ? 'Edit Company' : 'Add New Company'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="companyName" className="form-label">
                  Company Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
                {errors.companyName && (
                  <div className="invalid-feedback d-block">{errors.companyName}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="companyDescription" className="form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${
                    errors.companyDescription ? 'is-invalid' : ''
                  }`}
                  id="companyDescription"
                  name="companyDescription"
                  rows="4"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  placeholder="Enter company description"
                ></textarea>
                {errors.companyDescription && (
                  <div className="invalid-feedback d-block">
                    {errors.companyDescription}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="createdBy" className="form-label">
                  Created By <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.createdBy ? 'is-invalid' : ''}`}
                  id="createdBy"
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
                {errors.createdBy && (
                  <div className="invalid-feedback d-block">{errors.createdBy}</div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-warning">
                <i className="bi bi-check-circle me-2"></i>Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

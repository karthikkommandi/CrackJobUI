import React, { useState, useEffect } from 'react';

export default function QuestionModal({ show, onClose, onSave, question }) {
  const [formData, setFormData] = useState({ qname: '', qdesc: '', createdBy: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (question) {
      setFormData({
        qname: question.qname || '',
        qdesc: question.qdesc || '',
        createdBy: question.createdBy || '',
      });
    } else {
      setFormData({ qname: '', qdesc: '', createdBy: '' });
    }
    setErrors({});
  }, [question, show]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.qname.trim()) newErrors.qname = 'Question name is required';
    if (!formData.qdesc.trim()) newErrors.qdesc = 'Description is required';
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
      setFormData({ qname: '', qdesc: '', createdBy: '' });
    } else {
      setErrors(newErrors);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-plus-circle me-2"></i>
              {question ? 'Edit Question' : 'Add New Question'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="qname" className="form-label">
                  Question Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.qname ? 'is-invalid' : ''}`}
                  id="qname"
                  name="qname"
                  value={formData.qname}
                  onChange={handleChange}
                  placeholder="Enter question name"
                />
                {errors.qname && <div className="invalid-feedback d-block">{errors.qname}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="qdesc" className="form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${errors.qdesc ? 'is-invalid' : ''}`}
                  id="qdesc"
                  name="qdesc"
                  rows="4"
                  value={formData.qdesc}
                  onChange={handleChange}
                  placeholder="Enter question description"
                ></textarea>
                {errors.qdesc && <div className="invalid-feedback d-block">{errors.qdesc}</div>}
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
                {errors.createdBy && <div className="invalid-feedback d-block">{errors.createdBy}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-check-circle me-2"></i>Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

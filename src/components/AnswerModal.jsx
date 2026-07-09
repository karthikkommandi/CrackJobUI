import React, { useState, useEffect } from 'react';

export default function AnswerModal({ show, onClose, onSave, answer }) {
  const [formData, setFormData] = useState({ answer1: '', answerReference: '', createdBy: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (answer) {
      setFormData({
        answer1: answer.answer1 || '',
        answerReference: answer.answerReference || '',
        createdBy: answer.createdBy || '',
      });
    } else {
      setFormData({ answer1: '', answerReference: '', createdBy: '' });
    }
    setErrors({});
  }, [answer, show]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.answer1.trim()) newErrors.answer1 = 'Answer is required';
    if (!formData.answerReference.trim()) newErrors.answerReference = 'Reference is required';
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
      setFormData({ answer1: '', answerReference: '', createdBy: '' });
    } else {
      setErrors(newErrors);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <i className="bi bi-chat-left-text me-2"></i>
              {answer ? 'Edit Answer' : 'Add New Answer'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="answer1" className="form-label">
                  Answer <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${errors.answer1 ? 'is-invalid' : ''}`}
                  id="answer1"
                  name="answer1"
                  rows="4"
                  value={formData.answer1}
                  onChange={handleChange}
                  placeholder="Enter your answer"
                ></textarea>
                {errors.answer1 && <div className="invalid-feedback d-block">{errors.answer1}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="answerReference" className="form-label">
                  Reference Link <span className="text-danger">*</span>
                </label>
                <input
                  type="url"
                  className={`form-control ${errors.answerReference ? 'is-invalid' : ''}`}
                  id="answerReference"
                  name="answerReference"
                  value={formData.answerReference}
                  onChange={handleChange}
                  placeholder="Enter reference URL"
                />
                {errors.answerReference && <div className="invalid-feedback d-block">{errors.answerReference}</div>}
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
              <button type="submit" className="btn btn-success">
                <i className="bi bi-check-circle me-2"></i>Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

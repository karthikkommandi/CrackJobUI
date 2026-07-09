import React, { useState, useEffect } from 'react';

export default function CommentModal({ show, onClose, onSave, comment }) {
  const [formData, setFormData] = useState({
    comment1: '',
    userId: '',
    likeCount: 0,
    replyCount: 0,
    isDeleted: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (comment) {
      setFormData({
        comment1: comment.comment1 || '',
        userId: comment.userId || '',
        likeCount: comment.likeCount || 0,
        replyCount: comment.replyCount || 0,
        isDeleted: comment.isDeleted || false,
      });
    } else {
      setFormData({
        comment1: '',
        userId: '',
        likeCount: 0,
        replyCount: 0,
        isDeleted: false,
      });
    }
    setErrors({});
  }, [comment, show]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.comment1.trim()) newErrors.comment1 = 'Comment is required';
    if (!formData.userId.trim()) newErrors.userId = 'User ID is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
      setFormData({
        comment1: '',
        userId: '',
        likeCount: 0,
        replyCount: 0,
        isDeleted: false,
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
          <div className="modal-header bg-info text-white">
            <h5 className="modal-title">
              <i className="bi bi-chat-dots me-2"></i>
              {comment ? 'Edit Comment' : 'Add New Comment'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="comment1" className="form-label">
                  Comment <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${errors.comment1 ? 'is-invalid' : ''}`}
                  id="comment1"
                  name="comment1"
                  rows="4"
                  value={formData.comment1}
                  onChange={handleChange}
                  placeholder="Enter your comment"
                ></textarea>
                {errors.comment1 && <div className="invalid-feedback d-block">{errors.comment1}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="userId" className="form-label">
                  User ID <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.userId ? 'is-invalid' : ''}`}
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  placeholder="Enter user ID"
                />
                {errors.userId && <div className="invalid-feedback d-block">{errors.userId}</div>}
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="likeCount" className="form-label">
                    Likes
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="likeCount"
                    name="likeCount"
                    value={formData.likeCount}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="replyCount" className="form-label">
                    Replies
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="replyCount"
                    name="replyCount"
                    value={formData.replyCount}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isDeleted"
                  name="isDeleted"
                  checked={formData.isDeleted}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="isDeleted">
                  Mark as deleted
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-info">
                <i className="bi bi-check-circle me-2"></i>Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

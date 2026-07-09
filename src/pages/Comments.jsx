import React, { useState, useEffect } from 'react';
import { commentsAPI } from '../services/api';
import { ConfirmModal, LoadingSpinner, AlertMessage, EmptyState } from '../components/Common';
import CommentModal from '../components/CommentModal';

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentsAPI.getAll();
      setComments(response.data);
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to fetch comments' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedComment(null);
    setShowModal(true);
  };

  const handleEdit = (comment) => {
    setSelectedComment(comment);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedComment) {
        await commentsAPI.update(selectedComment.id, formData);
        setAlert({ type: 'success', message: 'Comment updated successfully' });
      } else {
        await commentsAPI.create(formData);
        setAlert({ type: 'success', message: 'Comment created successfully' });
      }
      setShowModal(false);
      fetchComments();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to save comment' });
    }
  };

  const handleDeleteClick = (comment) => {
    setSelectedComment(comment);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await commentsAPI.delete(selectedComment.id);
      setAlert({ type: 'success', message: 'Comment deleted successfully' });
      setShowDeleteModal(false);
      fetchComments();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to delete comment' });
    }
  };

  const filteredComments = comments.filter(c =>
    c.comment1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-md-6">
          <h1 className="h3">
            <i className="bi bi-chat-dots me-2"></i>Comments
          </h1>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-primary" onClick={handleCreate}>
            <i className="bi bi-plus-circle me-2"></i>Add Comment
          </button>
        </div>
      </div>

      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filteredComments.length === 0 ? (
            <EmptyState
              icon="chat-dots"
              title="No Comments Found"
              message="Create your first comment to get started"
            />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Comment</th>
                    <th>User ID</th>
                    <th>Likes</th>
                    <th>Replies</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComments.map((comment) => (
                    <tr key={comment.id}>
                      <td className="text-muted">{comment.id}</td>
                      <td className="text-truncate" style={{ maxWidth: '300px' }}>
                        {comment.comment1}
                      </td>
                      <td>{comment.userId}</td>
                      <td>
                        <span className="badge bg-info">
                          <i className="bi bi-hand-thumbs-up me-1"></i>
                          {comment.likeCount || 0}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          <i className="bi bi-chat me-1"></i>
                          {comment.replyCount || 0}
                        </span>
                      </td>
                      <td>
                        {comment.isDeleted ? (
                          <span className="badge bg-danger">Deleted</span>
                        ) : (
                          <span className="badge bg-success">Active</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(comment)}
                          title="Edit"
                          disabled={comment.isDeleted}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteClick(comment)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CommentModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        comment={selectedComment}
      />

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Comment"
        message={`Are you sure you want to delete this comment?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

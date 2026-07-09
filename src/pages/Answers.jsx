import React, { useState, useEffect } from 'react';
import { answersAPI } from '../services/api';
import { ConfirmModal, LoadingSpinner, AlertMessage, EmptyState } from '../components/Common';
import AnswerModal from '../components/AnswerModal';

export default function Answers() {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const response = await answersAPI.getAll();
      setAnswers(response.data);
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to fetch answers' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedAnswer(null);
    setShowModal(true);
  };

  const handleEdit = (answer) => {
    setSelectedAnswer(answer);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedAnswer) {
        await answersAPI.update(selectedAnswer.aid, formData);
        setAlert({ type: 'success', message: 'Answer updated successfully' });
      } else {
        await answersAPI.create(formData);
        setAlert({ type: 'success', message: 'Answer created successfully' });
      }
      setShowModal(false);
      fetchAnswers();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to save answer' });
    }
  };

  const handleDeleteClick = (answer) => {
    setSelectedAnswer(answer);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await answersAPI.delete(selectedAnswer.aid);
      setAlert({ type: 'success', message: 'Answer deleted successfully' });
      setShowDeleteModal(false);
      fetchAnswers();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to delete answer' });
    }
  };

  const filteredAnswers = answers.filter(a =>
    a.answer1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.answerReference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-md-6">
          <h1 className="h3">
            <i className="bi bi-chat-left-text me-2"></i>Answers
          </h1>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-primary" onClick={handleCreate}>
            <i className="bi bi-plus-circle me-2"></i>Add Answer
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
                placeholder="Search answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filteredAnswers.length === 0 ? (
            <EmptyState
              icon="chat-left-text"
              title="No Answers Found"
              message="Create your first answer to get started"
            />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Answer</th>
                    <th>Reference</th>
                    <th>Created By</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnswers.map((answer) => (
                    <tr key={answer.aid}>
                      <td className="text-muted">{answer.aid}</td>
                      <td className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>
                        {answer.answer1}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '200px' }}>
                        {answer.answerReference}
                      </td>
                      <td>{answer.createdBy}</td>
                      <td className="text-muted">
                        {new Date(answer.createdDate).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(answer)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteClick(answer)}
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

      <AnswerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        answer={selectedAnswer}
      />

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Answer"
        message={`Are you sure you want to delete this answer?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { questionsAPI } from '../services/api';
import { ConfirmModal, LoadingSpinner, AlertMessage, EmptyState } from '../components/Common';
import QuestionModal from '../components/QuestionModal';

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionsAPI.getAll();
      setQuestions(response.data);
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to fetch questions' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedQuestion(null);
    setShowModal(true);
  };

  const handleEdit = (question) => {
    setSelectedQuestion(question);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedQuestion) {
        await questionsAPI.update(selectedQuestion.qid, formData);
        setAlert({ type: 'success', message: 'Question updated successfully' });
      } else {
        await questionsAPI.create(formData);
        setAlert({ type: 'success', message: 'Question created successfully' });
      }
      setShowModal(false);
      fetchQuestions();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to save question' });
    }
  };

  const handleDeleteClick = (question) => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await questionsAPI.delete(selectedQuestion.qid);
      setAlert({ type: 'success', message: 'Question deleted successfully' });
      setShowDeleteModal(false);
      fetchQuestions();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to delete question' });
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.qname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.qdesc?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-md-6">
          <h1 className="h3">
            <i className="bi bi-question-lg me-2"></i>Interview Questions
          </h1>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-primary" onClick={handleCreate}>
            <i className="bi bi-plus-circle me-2"></i>Add Question
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
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filteredQuestions.length === 0 ? (
            <EmptyState
              icon="question-circle"
              title="No Questions Found"
              message="Create your first question to get started"
            />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Question</th>
                    <th>Description</th>
                    <th>Created By</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((question) => (
                    <tr key={question.qid}>
                      <td className="text-muted">{question.qid}</td>
                      <td className="fw-bold">{question.qname}</td>
                      <td className="text-truncate" style={{ maxWidth: '300px' }}>
                        {question.qdesc}
                      </td>
                      <td>{question.createdBy}</td>
                      <td className="text-muted">
                        {new Date(question.createdDate).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(question)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteClick(question)}
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

      <QuestionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        question={selectedQuestion}
      />

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Question"
        message={`Are you sure you want to delete "${selectedQuestion?.qname}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

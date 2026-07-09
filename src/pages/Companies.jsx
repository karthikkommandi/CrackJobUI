import React, { useState, useEffect } from 'react';
import { companiesAPI } from '../services/api';
import { ConfirmModal, LoadingSpinner, AlertMessage, EmptyState } from '../components/Common';
import CompanyModal from '../components/CompanyModal';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companiesAPI.getAll();
      setCompanies(response.data);
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to fetch companies' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCompany(null);
    setShowModal(true);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedCompany) {
        await companiesAPI.update(selectedCompany.id, formData);
        setAlert({ type: 'success', message: 'Company updated successfully' });
      } else {
        await companiesAPI.create(formData);
        setAlert({ type: 'success', message: 'Company created successfully' });
      }
      setShowModal(false);
      fetchCompanies();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to save company' });
    }
  };

  const handleDeleteClick = (company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await companiesAPI.delete(selectedCompany.id);
      setAlert({ type: 'success', message: 'Company deleted successfully' });
      setShowDeleteModal(false);
      fetchCompanies();
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to delete company' });
    }
  };

  const filteredCompanies = companies.filter(c =>
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.companyDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-md-6">
          <h1 className="h3">
            <i className="bi bi-building me-2"></i>Companies
          </h1>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-primary" onClick={handleCreate}>
            <i className="bi bi-plus-circle me-2"></i>Add Company
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
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filteredCompanies.length === 0 ? (
            <EmptyState
              icon="building"
              title="No Companies Found"
              message="Create your first company to get started"
            />
          ) : (
            <div className="row g-4">
              {filteredCompanies.map((company) => (
                <div key={company.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0 hover-shadow">
                    <div className="card-header bg-gradient">
                      <h5 className="card-title mb-0">
                        <i className="bi bi-building me-2 text-primary"></i>
                        {company.companyName}
                      </h5>
                    </div>
                    <div className="card-body">
                      <p className="card-text text-muted">
                        {company.companyDescription}
                      </p>
                      <div className="text-muted small">
                        <div className="mb-2">
                          <strong>Created By:</strong> {company.createdBy}
                        </div>
                        <div>
                          <strong>Date:</strong>{' '}
                          {new Date(company.createdDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-light d-flex gap-2">
                      <button
                        className="btn btn-sm btn-warning flex-grow-1"
                        onClick={() => handleEdit(company)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil me-1"></i>Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteClick(company)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CompanyModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        company={selectedCompany}
      />

      <ConfirmModal
        show={showDeleteModal}
        title="Delete Company"
        message={`Are you sure you want to delete "${selectedCompany?.companyName}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

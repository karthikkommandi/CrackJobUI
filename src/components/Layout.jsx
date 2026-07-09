import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export function Header() {
  const { username } = useUser();
  const [navOpen, setNavOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const closeNav = () => { setNavOpen(false); setAdminOpen(false); };

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top cj-navbar py-2">
        <div className="container cj-page">
          <Link className="navbar-brand text-gradient" to="/" onClick={closeNav}>
            <i className="bi bi-mortarboard-fill me-2"></i>CrackJobs
          </Link>

          <button className="navbar-toggler" type="button" onClick={() => setNavOpen((o) => !o)}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end onClick={closeNav}>
                  <i className="bi bi-house-door me-1"></i>Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/browse" onClick={closeNav}>
                  <i className="bi bi-collection me-1"></i>Browse Questions
                </NavLink>
              </li>

              <li className="nav-item dropdown position-relative">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  onClick={() => setAdminOpen((o) => !o)}
                >
                  <i className="bi bi-sliders me-1"></i>Manage
                </button>
                {adminOpen && (
                  <ul className="dropdown-menu show mt-1" style={{ display: 'block' }}>
                    <li><NavLink className="dropdown-item" to="/admin/questions" onClick={closeNav}>Questions</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/admin/answers" onClick={closeNav}>Answers</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/admin/companies" onClick={closeNav}>Companies</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/admin/technologies" onClick={closeNav}>Technologies</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/admin/roles" onClick={closeNav}>Job Roles</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/admin/comments" onClick={closeNav}>Comments</NavLink></li>
                  </ul>
                )}
              </li>

              <li className="nav-item ms-lg-2">
                <button className="btn btn-outline-brand btn-sm rounded-pill px-3" onClick={() => setShowModal(true)}>
                  <i className="bi bi-person-circle me-1"></i>
                  {username ? username : 'Sign in'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <UsernameModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

export function UsernameModal({ show, onClose }) {
  const { username, setUsername } = useUser();
  const [name, setName] = useState(username);

  React.useEffect(() => { setName(username); }, [username, show]);

  if (!show) return null;

  const save = (e) => {
    e.preventDefault();
    setUsername(name);
    onClose();
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(15,17,30,0.55)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '18px' }}>
          <div className="modal-header border-0">
            <h5 className="modal-title cj-section-title">
              <i className="bi bi-person-badge me-2 text-gradient"></i>Choose a display name
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={save}>
            <div className="modal-body">
              <p className="text-muted small mb-3">
                No password needed — your name is used to attribute your comments and likes.
              </p>
              <input
                autoFocus
                className="form-control form-control-lg"
                placeholder="e.g. alex_dev"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="modal-footer border-0">
              {username && (
                <button type="button" className="btn btn-link text-muted me-auto"
                  onClick={() => { setUsername(''); onClose(); }}>
                  Sign out
                </button>
              )}
              <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-brand px-4" disabled={!name.trim()}>Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="text-center py-4 mt-5 text-muted border-top">
      <div className="container cj-page">
        <p className="mb-0 small">
          <i className="bi bi-mortarboard-fill me-1 text-gradient"></i>
          &copy; {currentYear} CrackJobs — learn from real interview questions across top companies.
        </p>
      </div>
    </footer>
  );
}

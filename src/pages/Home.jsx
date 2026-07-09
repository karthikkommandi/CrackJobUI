import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { questionsAPI, companiesAPI, jobRolesAPI, technologiesAPI } from '../services/api';
import { LoadingSpinner, Chip } from '../components/Common';

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [techs, setTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      questionsAPI.getAll(),
      companiesAPI.getAll(),
      jobRolesAPI.getAll(),
      technologiesAPI.getAll(),
    ])
      .then(([q, c, r, t]) => {
        setQuestions(q.data);
        setCompanies(c.data);
        setRoles(r.data);
        setTechs(t.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = [...questions]
    .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
    .slice(0, 4);

  return (
    <div className="container cj-page py-4">
      {/* Hero */}
      <section className="cj-hero mb-5">
        <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
          <div className="col-lg-8">
            <span className="badge rounded-pill bg-light text-dark mb-3 px-3 py-2">
              <i className="bi bi-stars me-1"></i>Real questions from real interviews
            </span>
            <h1 className="mb-3">Crack your next tech interview with confidence.Bla Bla</h1>
            <p className="lead mb-4 opacity-75">
              Browse interview questions asked at top companies, filtered by role and technology.
              Read expert answers, then join the discussion with comments and likes.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/browse" className="btn btn-light btn-lg px-4 fw-semibold">
                <i className="bi bi-collection me-2"></i>Browse Questions
              </Link>
              <Link to="/admin/questions" className="btn btn-outline-light btn-lg px-4">
                <i className="bi bi-plus-circle me-2"></i>Contribute
              </Link>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Stats */}
          <div className="row g-3 mb-5">
            <StatCard icon="patch-question" num={questions.length} label="Questions" onClick={() => navigate('/browse')} />
            <StatCard icon="building" num={companies.length} label="Companies" onClick={() => navigate('/browse')} />
            <StatCard icon="person-workspace" num={roles.length} label="Job Roles" onClick={() => navigate('/browse')} />
            <StatCard icon="cpu" num={techs.length} label="Technologies" onClick={() => navigate('/browse')} />
          </div>

          {/* Featured */}
          <div className="d-flex justify-content-between align-items-end mb-3">
            <h2 className="h4 cj-section-title mb-0"><i className="bi bi-fire text-gradient me-2"></i>Most liked questions</h2>
            <Link to="/browse" className="text-decoration-none fw-semibold">View all <i className="bi bi-arrow-right"></i></Link>
          </div>
          <div className="row g-4 mb-5">
            {featured.map((q) => (
              <div className="col-md-6" key={q.qid}>
                <QuestionMiniCard q={q} />
              </div>
            ))}
          </div>

          {/* Browse by role */}
          <h2 className="h4 cj-section-title mb-3"><i className="bi bi-person-workspace text-gradient me-2"></i>Explore by job role</h2>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {roles.map((r) => (
              <Link key={r.roleId} to={`/browse?role=${r.roleId}`} className="text-decoration-none">
                <Chip icon="briefcase" variant="role">{r.roleName}</Chip>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, num, label, onClick }) {
  return (
    <div className="col-6 col-md-3">
      <div className="cj-stat p-4 text-center cursor-pointer h-100" onClick={onClick}>
        <i className={`bi bi-${icon} fs-3 text-gradient`}></i>
        <div className="cj-stat-num text-gradient mt-1">{num}</div>
        <div className="text-muted small fw-semibold">{label}</div>
      </div>
    </div>
  );
}

function QuestionMiniCard({ q }) {
  return (
    <Link to={`/questions/${q.qid}`} className="text-reset text-decoration-none">
      <div className="cj-card p-4">
        <div className="d-flex flex-wrap gap-2 mb-2">
          {(q.technologies || []).slice(0, 2).map((t) => (
            <Chip key={t.techId} icon="cpu">{t.techName}</Chip>
          ))}
          {(q.companies || []).slice(0, 1).map((c) => (
            <Chip key={c.id} icon="building" variant="company">{c.companyName}</Chip>
          ))}
        </div>
        <h3 className="h6 fw-bold mb-2">{q.qname}</h3>
        <p className="text-muted small mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {q.qdesc}
        </p>
        <div className="d-flex align-items-center gap-3 text-muted small">
          <span><i className="bi bi-heart-fill text-danger me-1"></i>{q.likeCount || 0}</span>
          <span><i className="bi bi-chat-left-text me-1"></i>{(q.answers || []).length} answer{(q.answers || []).length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </Link>
  );
}

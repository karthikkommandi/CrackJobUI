import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { questionsAPI, companiesAPI, jobRolesAPI, technologiesAPI } from '../services/api';
import { LoadingSpinner, EmptyState, Chip, LikeButton } from '../components/Common';

export default function Browse() {
  const [questions, setQuestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [techs, setTechs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const companyId = searchParams.get('company') || '';
  const roleId = searchParams.get('role') || '';
  const techId = searchParams.get('tech') || '';

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

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };

  const clearAll = () => { setSearch(''); setSearchParams(new URLSearchParams()); };

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return questions.filter((q) => {
      if (s && !(`${q.qname} ${q.qdesc}`.toLowerCase().includes(s))) return false;
      if (companyId && !(q.companies || []).some((c) => String(c.id) === companyId)) return false;
      if (roleId && !(q.jobRoles || []).some((r) => String(r.roleId) === roleId)) return false;
      if (techId && !(q.technologies || []).some((t) => String(t.techId) === techId)) return false;
      return true;
    });
  }, [questions, search, companyId, roleId, techId]);

  const activeFilterCount = [companyId, roleId, techId].filter(Boolean).length + (search ? 1 : 0);

  return (
    <div className="container cj-page py-4">
      <div className="mb-4">
        <h1 className="h3 cj-section-title mb-1">Browse Interview Questions</h1>
        <p className="text-muted">Filter by company, role or technology to find exactly what you need.</p>
      </div>

      <div className="row g-4">
        {/* Sidebar filters */}
        <div className="col-lg-3">
          <div className="cj-card p-3 p-lg-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold"><i className="bi bi-funnel me-1"></i>Filters</span>
              {activeFilterCount > 0 && (
                <button className="btn btn-sm btn-link text-decoration-none p-0" onClick={clearAll}>Clear</button>
              )}
            </div>

            <FilterGroup
              label="Company"
              options={companies.map((c) => ({ value: String(c.id), label: c.companyName }))}
              value={companyId}
              onChange={(v) => setFilter('company', v)}
            />
            <FilterGroup
              label="Job Role"
              options={roles.map((r) => ({ value: String(r.roleId), label: r.roleName }))}
              value={roleId}
              onChange={(v) => setFilter('role', v)}
            />
            <FilterGroup
              label="Technology"
              options={techs.map((t) => ({ value: String(t.techId), label: t.techName }))}
              value={techId}
              onChange={(v) => setFilter('tech', v)}
            />
          </div>
        </div>

        {/* Results */}
        <div className="col-lg-9">
          <div className="input-group mb-3">
            <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
            <input
              className="form-control"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filtered.length === 0 ? (
            <EmptyState icon="search" title="No questions match" message="Try removing a filter or changing your search." />
          ) : (
            <>
              <p className="text-muted small mb-3">{filtered.length} question{filtered.length === 1 ? '' : 's'}</p>
              <div className="d-flex flex-column gap-3">
                {filtered.map((q) => <QuestionRow key={q.qid} q={q} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="mb-3">
      <div className="text-muted small fw-semibold text-uppercase mb-2">{label}</div>
      <div className="d-flex flex-column gap-1" style={{ maxHeight: 220, overflowY: 'auto' }}>
        <button
          className={`btn btn-sm text-start ${!value ? 'btn-brand' : 'btn-light'}`}
          onClick={() => onChange('')}
        >All</button>
        {options.map((o) => (
          <button
            key={o.value}
            className={`btn btn-sm text-start ${value === o.value ? 'btn-brand' : 'btn-light'}`}
            onClick={() => onChange(o.value)}
          >{o.label}</button>
        ))}
      </div>
    </div>
  );
}

function QuestionRow({ q }) {
  return (
    <div className="cj-card p-4">
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div className="flex-grow-1">
          <div className="d-flex flex-wrap gap-2 mb-2">
            {(q.technologies || []).map((t) => <Chip key={t.techId} icon="cpu">{t.techName}</Chip>)}
            {(q.jobRoles || []).map((r) => <Chip key={r.roleId} icon="briefcase" variant="role">{r.roleName}</Chip>)}
            {(q.companies || []).map((c) => <Chip key={c.id} icon="building" variant="company">{c.companyName}</Chip>)}
          </div>
          <Link to={`/questions/${q.qid}`} className="text-reset text-decoration-none">
            <h2 className="h5 fw-bold mb-1">{q.qname}</h2>
          </Link>
          <p className="text-muted mb-3">{q.qdesc}</p>
          <div className="d-flex align-items-center gap-3">
            <LikeButton type="question" id={q.qid} initialCount={q.likeCount} size="sm" />
            <span className="text-muted small"><i className="bi bi-chat-left-text me-1"></i>{(q.answers || []).length} answer{(q.answers || []).length === 1 ? '' : 's'}</span>
            <Link to={`/questions/${q.qid}`} className="btn btn-sm btn-outline-brand rounded-pill ms-auto">
              View & discuss <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

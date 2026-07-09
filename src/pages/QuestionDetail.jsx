import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { questionsAPI, commentsAPI } from '../services/api';
import { LoadingSpinner, AlertMessage, Chip, LikeButton } from '../components/Common';
import { UsernameModal } from '../components/Layout';
import { useUser } from '../context/UserContext';

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const load = async () => {
    try {
      const res = await questionsAPI.getById(id);
      setQuestion(res.data);
      setComments(res.data.comments || []);
    } catch {
      setAlert({ type: 'danger', message: 'Failed to load question.' });
    } finally {
      setLoading(false);
    }
  };

  const reloadComments = async () => {
    try {
      const res = await questionsAPI.getComments(id);
      setComments(res.data);
    } catch { /* ignore */ }
  };

  useEffect(() => { setLoading(true); load(); /* eslint-disable-next-line */ }, [id]);

  if (loading) return <div className="container cj-page py-5"><LoadingSpinner /></div>;
  if (!question) return (
    <div className="container cj-page py-5">
      <AlertMessage type="danger" message="Question not found." onClose={() => {}} />
      <Link to="/browse" className="btn btn-brand">Back to browse</Link>
    </div>
  );

  const totalComments = comments.reduce((n, c) => n + 1 + (c.replies?.length || 0), 0);

  return (
    <div className="container cj-page py-4">
      <Link to="/browse" className="btn btn-sm btn-light rounded-pill mb-3">
        <i className="bi bi-arrow-left me-1"></i>Back to questions
      </Link>

      {alert && <AlertMessage type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Question header */}
      <div className="cj-card p-4 p-lg-5 mb-4">
        <div className="d-flex flex-wrap gap-2 mb-3">
          {(question.technologies || []).map((t) => <Chip key={t.techId} icon="cpu">{t.techName}</Chip>)}
          {(question.jobRoles || []).map((r) => <Chip key={r.roleId} icon="briefcase" variant="role">{r.roleName}</Chip>)}
          {(question.companies || []).map((c) => <Chip key={c.id} icon="building" variant="company">{c.companyName}</Chip>)}
        </div>
        <h1 className="h3 fw-bold mb-3">{question.qname}</h1>
        <p className="text-muted fs-6 mb-4">{question.qdesc}</p>
        <div className="d-flex align-items-center gap-3">
          <LikeButton type="question" id={question.qid} initialCount={question.likeCount} />
          <span className="text-muted small">
            <i className="bi bi-chat-dots me-1"></i>{totalComments} comment{totalComments === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Answers */}
      <h2 className="h5 cj-section-title mb-3">
        <i className="bi bi-lightbulb text-gradient me-2"></i>
        {(question.answers || []).length} Answer{(question.answers || []).length === 1 ? '' : 's'}
      </h2>
      <div className="d-flex flex-column gap-3 mb-5">
        {(question.answers || []).length === 0 && (
          <p className="text-muted">No answers yet.</p>
        )}
        {(question.answers || []).map((a) => (
          <div className="cj-answer" key={a.aid}>
            <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>{a.answer1}</p>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <LikeButton type="answer" id={a.aid} initialCount={a.likeCount} size="sm" />
              {a.answerReference && (
                <a href={a.answerReference} target="_blank" rel="noreferrer" className="small text-decoration-none">
                  <i className="bi bi-link-45deg me-1"></i>Reference
                </a>
              )}
              {a.createdBy && <span className="text-muted small ms-auto">by {a.createdBy}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Comments */}
      <h2 className="h5 cj-section-title mb-3">
        <i className="bi bi-chat-square-text text-gradient me-2"></i>Discussion
      </h2>
      <CommentComposer questionId={question.qid} onPosted={reloadComments} onNotice={setAlert} />

      <div className="d-flex flex-column gap-3 mt-4">
        {comments.length === 0 && <p className="text-muted">Be the first to comment.</p>}
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} questionId={question.qid} onChanged={reloadComments} onNotice={setAlert} />
        ))}
      </div>
    </div>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  const units = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [name, s] of units) {
    const v = Math.floor(secs / s);
    if (v >= 1) return `${v} ${name}${v === 1 ? '' : 's'} ago`;
  }
  return 'just now';
}

function CommentComposer({ questionId, parentId = null, onPosted, onNotice, compact = false, onCancel }) {
  const { username } = useUser();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [askName, setAskName] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!username) { setAskName(true); return; }
    if (!text.trim()) return;
    setBusy(true);
    try {
      await commentsAPI.create({
        comment1: text.trim(),
        userId: username,
        questionId,
        parrentCommentId: parentId,
      });
      setText('');
      if (onCancel) onCancel();
      onPosted();
    } catch {
      onNotice?.({ type: 'danger', message: 'Failed to post comment.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <form onSubmit={submit} className={compact ? '' : 'cj-card p-3'}>
        <textarea
          className="form-control border-0 bg-light"
          rows={compact ? 2 : 3}
          placeholder={username ? (parentId ? 'Write a reply...' : 'Share your thoughts or a tip...') : 'Sign in to join the discussion'}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="d-flex justify-content-end gap-2 mt-2">
          {onCancel && <button type="button" className="btn btn-sm btn-light" onClick={onCancel}>Cancel</button>}
          <button type="submit" className="btn btn-sm btn-brand px-3" disabled={busy}>
            <i className="bi bi-send me-1"></i>{parentId ? 'Reply' : 'Comment'}
          </button>
        </div>
      </form>
      <UsernameModal show={askName} onClose={() => setAskName(false)} />
    </>
  );
}

function CommentItem({ comment, questionId, onChanged, onNotice }) {
  const [showReply, setShowReply] = useState(false);
  const initial = (comment.userId || '?').charAt(0).toUpperCase();

  return (
    <div className="cj-comment">
      <div className="d-flex gap-3">
        <div className="cj-avatar">{initial}</div>
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="fw-semibold">{comment.userId}</span>
            <span className="text-muted small">· {timeAgo(comment.createdDate)}</span>
          </div>
          <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>{comment.comment1}</p>
          <div className="d-flex align-items-center gap-3">
            <LikeButton type="comment" id={comment.id} initialCount={comment.likeCount} size="sm" />
            <button className="btn btn-sm btn-link text-decoration-none p-0 text-muted" onClick={() => setShowReply((s) => !s)}>
              <i className="bi bi-reply me-1"></i>Reply
            </button>
          </div>

          {showReply && (
            <div className="mt-3">
              <CommentComposer
                questionId={questionId}
                parentId={comment.id}
                compact
                onPosted={onChanged}
                onNotice={onNotice}
                onCancel={() => setShowReply(false)}
              />
            </div>
          )}

          {(comment.replies || []).length > 0 && (
            <div className="mt-3 d-flex flex-column gap-3">
              {comment.replies.map((r) => (
                <div className="cj-reply d-flex gap-3" key={r.id}>
                  <div className="cj-avatar" style={{ width: 30, height: 30, fontSize: '0.8rem' }}>
                    {(r.userId || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-semibold small">{r.userId}</span>
                      <span className="text-muted small">· {timeAgo(r.createdDate)}</span>
                    </div>
                    <p className="mb-1 small" style={{ whiteSpace: 'pre-wrap' }}>{r.comment1}</p>
                    <LikeButton type="comment" id={r.id} initialCount={r.likeCount} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

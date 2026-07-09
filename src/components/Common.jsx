import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { UsernameModal } from './Layout';

// A pill-shaped like button wired to the shared user/likes context.
// `type` is one of 'question' | 'answer' | 'comment'.
export function LikeButton({ type, id, initialCount = 0, size = '' }) {
  const { username, isLiked, toggleLike } = useUser();
  const [count, setCount] = useState(Number(initialCount) || 0);
  const [busy, setBusy] = useState(false);
  const [promptSignIn, setPromptSignIn] = useState(false);
  const liked = isLiked(type, id);

  const onClick = async () => {
    if (!username) { setPromptSignIn(true); return; }
    if (busy) return;
    setBusy(true);
    try {
      const res = await toggleLike(type, id);
      if (res) setCount(res.count);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`cj-like ${liked ? 'liked' : ''} ${size === 'sm' ? 'py-1 px-2' : ''}`}
        onClick={onClick}
        disabled={busy}
        title={username ? (liked ? 'Unlike' : 'Like') : 'Sign in to like'}
      >
        <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        <span>{count}</span>
      </button>
      <UsernameModal show={promptSignIn} onClose={() => setPromptSignIn(false)} />
    </>
  );
}

export function Chip({ icon, children, variant = '' }) {
  return (
    <span className={`cj-chip ${variant}`}>
      {icon && <i className={`bi bi-${icon}`}></i>}
      {children}
    </span>
  );
}

export function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export function AlertMessage({ type, message, onClose }) {
  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
}

export function EmptyState({ icon = 'inbox', title = 'No data', message = 'There are no records to display' }) {
  return (
    <div className="text-center py-5">
      <i className={`bi bi-${icon} display-1 text-muted`}></i>
      <h5 className="mt-3 text-muted">{title}</h5>
      <p className="text-muted">{message}</p>
    </div>
  );
}

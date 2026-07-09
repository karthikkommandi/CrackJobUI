import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { likesAPI } from '../services/api';

const UserContext = createContext(null);

const STORAGE_KEY = 'crackjobs.username';

const likeKey = (type, id) => `${type}:${id}`;

export function UserProvider({ children }) {
  const [username, setUsernameState] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  // Set of "type:id" keys the current user has liked.
  const [likedSet, setLikedSet] = useState(() => new Set());

  const refreshLikes = useCallback(async (name) => {
    const who = name ?? username;
    if (!who) {
      setLikedSet(new Set());
      return;
    }
    try {
      const res = await likesAPI.byUser(who);
      setLikedSet(new Set(res.data.map((l) => likeKey(l.targetType, l.targetId))));
    } catch {
      setLikedSet(new Set());
    }
  }, [username]);

  useEffect(() => {
    if (username) refreshLikes(username);
  }, [username, refreshLikes]);

  const setUsername = useCallback((name) => {
    const trimmed = (name || '').trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setUsernameState(trimmed);
  }, []);

  const isLiked = useCallback((type, id) => likedSet.has(likeKey(type, id)), [likedSet]);

  // Toggles a like, updates local state optimistically, and returns the new count.
  const toggleLike = useCallback(async (type, id) => {
    if (!username) return null;
    const res = await likesAPI.toggle(username, type, id);
    const { liked, count } = res.data;
    setLikedSet((prev) => {
      const next = new Set(prev);
      if (liked) next.add(likeKey(type, id));
      else next.delete(likeKey(type, id));
      return next;
    });
    return { liked, count };
  }, [username]);

  const value = { username, setUsername, isLiked, toggleLike, refreshLikes };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { localNotes, downloadNotesAsJson, parseNotesJsonFile } from '../lib/localNotes';

// Gives every consumer the same shape (notes, create, update, remove, ...)
// regardless of whether the user is logged in. Components never need to
// branch on auth state themselves — this hook is the one place that does.
export function useNotes() {
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (isAuthenticated) {
        const data = await api.listNotes();
        setNotes(data.notes);
      } else {
        setNotes(localNotes.getAll());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createNote = useCallback(
    async (data = {}) => {
      const note = isAuthenticated
        ? (await api.createNote(data)).note
        : localNotes.create(data);
      setNotes((prev) => [note, ...prev]);
      return note;
    },
    [isAuthenticated]
  );

  const updateNote = useCallback(
    async (id, patch) => {
      const note = isAuthenticated
        ? (await api.updateNote(id, patch)).note
        : localNotes.update(id, patch);
      setNotes((prev) => prev.map((n) => (n.id === id ? note : n)));
      return note;
    },
    [isAuthenticated]
  );

  const deleteNote = useCallback(
    async (id) => {
      if (isAuthenticated) {
        await api.deleteNote(id);
      } else {
        localNotes.remove(id);
      }
      setNotes((prev) => prev.filter((n) => n.id !== id));
    },
    [isAuthenticated]
  );

  // Notes are already loaded in state with full content, for both modes —
  // no need for a separate fetch-single-note call.
  const getNote = useCallback((id) => notes.find((n) => n.id === id) || null, [notes]);

  const exportNotes = useCallback(() => {
    downloadNotesAsJson(notes);
  }, [notes]);

  const importNotes = useCallback(
    async (file) => {
      const parsed = await parseNotesJsonFile(file);
      if (isAuthenticated) {
        const { notes: created } = await api.uploadNotes(parsed);
        setNotes((prev) => [...created, ...prev]);
        return created;
      }
      const created = localNotes.importMany(parsed);
      setNotes((prev) => [...created, ...prev]);
      return created;
    },
    [isAuthenticated]
  );

  return {
    notes,
    loading,
    error,
    isGuest: !isAuthenticated,
    refresh,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    exportNotes,
    importNotes,
  };
}
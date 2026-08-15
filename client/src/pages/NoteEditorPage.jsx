import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import './NoteEditorPage.css';

const AUTOSAVE_DELAY_MS = 800;

function NoteEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNote, updateNote, deleteNote } = useOutletContext();

  const note = getNote(id);

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved

  const saveTimeoutRef = useRef(null);
  const currentIdRef = useRef(id);

  // Reset local editor state whenever the selected note changes.
  useEffect(() => {
    currentIdRef.current = id;
    setTitle(note?.title ?? '');
    setContent(note?.content ?? '');
    setSaveState('idle');
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const scheduleSave = useCallback(
    (patch) => {
      setSaveState('saving');
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(async () => {
        const savingForId = currentIdRef.current;
        await updateNote(savingForId, patch);
        // Only clear "saving" if the user hasn't already navigated to a
        // different note in the meantime.
        if (currentIdRef.current === savingForId) {
          setSaveState('saved');
        }
      }, AUTOSAVE_DELAY_MS);
    },
    [updateNote]
  );

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  function handleTitleChange(e) {
    const value = e.target.value;
    setTitle(value);
    scheduleSave({ title: value });
  }

  function handleContentChange(e) {
    const value = e.target.value;
    setContent(value);
    scheduleSave({ content: value });
  }

  async function handleDelete() {
    if (!confirm('Delete this note? This can\'t be undone.')) return;
    await deleteNote(id);
    navigate('/notes', { replace: true });
  }

  if (!note) {
    return (
      <div className="editor-missing">
        <p>This note couldn't be found.</p>
      </div>
    );
  }

  return (
    <div className="editor">
      <div className="editor__toolbar">
        <span className="editor__save-state">
          {saveState === 'saving' && 'Saving…'}
          {saveState === 'saved' && 'Saved'}
        </span>
        <button className="editor__delete-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>

      <input
        className="editor__title"
        value={title}
        onChange={handleTitleChange}
        placeholder="Untitled"
      />

      {/* The typing layer. A drawing layer will sit above this as a
          transparent canvas once that feature is built — content and
          drawing data will be saved as separate fields on the note. */}
      <textarea
        className="editor__content"
        value={content}
        onChange={handleContentChange}
        placeholder="Start writing…"
      />
    </div>
  );
}

export default NoteEditorPage;
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import TiptapEditor from '../components/TiptapEditor';
import { parseNoteContent, serializeNoteContent } from '../lib/noteContent';
import './NoteEditorPage.css';

const AUTOSAVE_DELAY_MS = 800;

function NoteEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNote, updateNote, deleteNote } = useOutletContext();

  const note = getNote(id);

  const [title, setTitle] = useState(note?.title || '');
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved

  const saveTimeoutRef = useRef(null);
  const currentIdRef = useRef(id);

  // Reset the title field whenever the selected note changes. The editor
  // body doesn't need this — it's remounted via `key={id}` below instead,
  // which re-initializes its content fresh per note.
  useEffect(() => {
    currentIdRef.current = id;
    setTitle(note?.title ?? '');
    setSaveState('idle');
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const scheduleSave = useCallback(
    (patch) => {
      setSaveState('saving');
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(async () => {
        const savingForId = currentIdRef.current;
        await updateNote(savingForId, patch);
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

  function handleContentChange(doc) {
    scheduleSave({ content: serializeNoteContent(doc) });
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

      {/* key={id} forces a fresh editor instance per note, so switching
          notes re-initializes content cleanly instead of needing to sync
          a `content` prop into a live editor mid-typing. A drawing layer
          will sit above this as a transparent canvas once that feature
          is built, saved as a separate field alongside this JSON. */}
      <TiptapEditor
        key={id}
        initialContent={parseNoteContent(note.content)}
        onChange={handleContentChange}
      />
    </div>
  );
}

export default NoteEditorPage;
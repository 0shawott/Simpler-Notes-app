import { useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Wordmark from './Wordmark';
import './NotesSidebar.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function NotesSidebar({ notes, loading, isGuest, onCreate, onExport, onImport }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  async function handleCreate() {
    const note = await onCreate();
    navigate(`/notes/${note.id}`);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await onImport(file);
    } catch (err) {
      alert(err.message);
    } finally {
      e.target.value = '';
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <Wordmark />
      </div>

      <button className="sidebar__new-btn" onClick={handleCreate}>
        + New note
      </button>

      <nav className="sidebar__list">
        {loading && <p className="sidebar__hint">Loading…</p>}

        {!loading && notes.length === 0 && (
          <p className="sidebar__hint">No notes yet. Create your first one above.</p>
        )}

        {notes.map((note) => (
          <NavLink
            key={note.id}
            to={`/notes/${note.id}`}
            className={({ isActive }) => `sidebar__item${isActive ? ' sidebar__item--active' : ''}`}
          >
            <span className="sidebar__item-title">{note.title || 'Untitled'}</span>
            <span className="sidebar__item-date">{formatDate(note.updatedAt)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__io">
          <button className="sidebar__io-btn" onClick={onExport} disabled={notes.length === 0}>
            Download all
          </button>
          <button className="sidebar__io-btn" onClick={handleImportClick}>
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={handleFileChange}
          />
        </div>

        {isGuest ? (
          <div className="sidebar__guest">
            <p>Notes are stored on this device only.</p>
            <Link to="/login" state={{ from: '/notes' }}>
              Log in to sync
            </Link>
          </div>
        ) : (
          <div className="sidebar__account">
            <span className="sidebar__account-email">{user?.email}</span>
            <button className="sidebar__logout" onClick={logout}>
              Log out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default NotesSidebar;
import { useAuth } from '../context/AuthContext';

// Placeholder — the real notes list + editor is built next.
// This exists now just so login/register have somewhere to redirect to,
// and so you can confirm the auth flow works end to end.
function NotesListPage() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div style={{ padding: 32 }}>
      <h1>Notes</h1>
      {isAuthenticated ? (
        <>
          <p>Signed in as {user?.email}</p>
          <button className="btn-primary" onClick={logout}>
            Log out
          </button>
        </>
      ) : (
        <p>Browsing as a guest — notes will be stored locally only.</p>
      )}
      <p style={{ color: 'var(--ink-faint)', marginTop: 16 }}>
        Notes list and editor coming next.
      </p>
    </div>
  );
}

export default NotesListPage;
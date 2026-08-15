import { Outlet } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import NotesSidebar from '../components/NotesSidebar';
import './NotesLayout.css';

function NotesLayout() {
  const notesState = useNotes();

  return (
    <div className="notes-layout">
      <NotesSidebar
        notes={notesState.notes}
        loading={notesState.loading}
        isGuest={notesState.isGuest}
        onCreate={notesState.createNote}
        onExport={notesState.exportNotes}
        onImport={notesState.importNotes}
      />
      <main className="notes-main">
        {/* Nested routes (empty state / editor) get the shared notes
            state via Outlet context, instead of each re-running useNotes
            and ending up with a separate copy of the data. */}
        <Outlet context={notesState} />
      </main>
    </div>
  );
}

export default NotesLayout;
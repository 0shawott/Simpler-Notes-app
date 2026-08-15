import { useOutletContext } from 'react-router-dom';

function NotesEmptyState() {
  const { notes } = useOutletContext();

  return (
    <div className="notes-empty">
      <p>{notes.length === 0 ? 'Create your first note to get started.' : 'Select a note, or create a new one.'}</p>
    </div>
  );
}

export default NotesEmptyState;
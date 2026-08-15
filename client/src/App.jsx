import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotesLayout from './pages/NotesLayout';
import NotesEmptyState from './pages/NotesEmptyState';
import NoteEditorPage from './pages/NoteEditorPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* /notes is reachable by guests too — auth is only required
              once a note actually needs to be saved to the DB, which
              useNotes() handles transparently */}
          <Route path="/notes" element={<NotesLayout />}>
            <Route index element={<NotesEmptyState />} />
            <Route path=":id" element={<NoteEditorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
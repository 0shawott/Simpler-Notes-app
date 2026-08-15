import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotesListPage from './pages/NotesListPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* /notes is reachable by guests too — auth is only required
              once a note actually needs to be saved to the DB */}
          <Route path="/notes" element={<NotesListPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
const BASE_URL = '/api';

// Reads the token fresh from localStorage on every call rather than
// caching it in a module variable — keeps this file decoupled from
// AuthContext and avoids stale-token bugs after login/logout.
function getToken() {
  return localStorage.getItem('token');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 204 No Content (delete) has no body to parse
  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  register: (email, password) =>
    request('/auth/register', { method: 'POST', body: { email, password }, auth: false }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),

  listNotes: () => request('/notes'),

  getNote: (id) => request(`/notes/${id}`),

  createNote: (note) => request('/notes', { method: 'POST', body: note }),

  updateNote: (id, note) => request(`/notes/${id}`, { method: 'PUT', body: note }),

  deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),

  uploadNotes: (notes) => request('/notes/bulk', { method: 'POST', body: { notes } }),
};
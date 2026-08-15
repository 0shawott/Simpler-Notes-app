const STORAGE_KEY = 'guest_notes';

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function makeId() {
  return crypto.randomUUID();
}

export const localNotes = {
  getAll() {
    return readAll().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  getOne(id) {
    return readAll().find((n) => n.id === id) || null;
  },

  create({ title, content } = {}) {
    const now = new Date().toISOString();
    const note = {
      id: makeId(),
      title: title?.trim() ? title : 'Untitled',
      content: content || '',
      createdAt: now,
      updatedAt: now,
    };
    writeAll([note, ...readAll()]);
    return note;
  },

  update(id, patch) {
    const notes = readAll();
    const idx = notes.findIndex((n) => n.id === id);
    if (idx === -1) return null;

    const updated = { ...notes[idx], ...patch, updatedAt: new Date().toISOString() };
    notes[idx] = updated;
    writeAll(notes);
    return updated;
  },

  remove(id) {
    writeAll(readAll().filter((n) => n.id !== id));
  },

  // Adds a batch of imported notes (e.g. from an uploaded JSON file)
  // as new local notes, assigning fresh ids/timestamps.
  importMany(notes) {
    const now = new Date().toISOString();
    const withIds = notes.map((n) => ({
      id: makeId(),
      title: typeof n.title === 'string' && n.title.trim() ? n.title : 'Untitled',
      content: typeof n.content === 'string' ? n.content : '',
      createdAt: n.createdAt || now,
      updatedAt: now,
    }));
    writeAll([...withIds, ...readAll()]);
    return withIds;
  },
};

// Triggers a browser download of the given notes as a .json file.
export function downloadNotesAsJson(notes, filename = 'notes-export.json') {
  const payload = notes.map(({ title, content, createdAt, updatedAt }) => ({
    title,
    content,
    createdAt,
    updatedAt,
  }));
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Reads an uploaded .json file and returns a parsed array of notes.
// Throws if the file isn't valid JSON or isn't shaped like a note array.
export function parseNotesJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const notes = Array.isArray(parsed) ? parsed : parsed.notes;
        if (!Array.isArray(notes)) {
          throw new Error('File does not contain a notes array');
        }
        resolve(notes);
      } catch (err) {
        reject(new Error('Could not read this file as a notes export'));
      }
    };
    reader.onerror = () => reject(new Error('Could not read the file'));
    reader.readAsText(file);
  });
}
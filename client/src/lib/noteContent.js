const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] };

// Notes are stored as a stringified Tiptap/ProseMirror JSON document.
// This also transparently upgrades any note saved before the Tiptap
// switch, when `content` was just a plain string — those get wrapped
// into a single paragraph instead of failing to load.
export function parseNoteContent(raw) {
  if (!raw) return EMPTY_DOC;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.type === 'doc') {
      return parsed;
    }
  } catch {
    // not JSON — must be a legacy plain-text note, fall through
  }

  return {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: String(raw) }] }],
  };
}

export function serializeNoteContent(doc) {
  return JSON.stringify(doc);
}
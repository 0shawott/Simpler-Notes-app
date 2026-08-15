import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './EditorToolbar';
import './TiptapEditor.css';

function TiptapEditor({ initialContent, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: 'Start writing…' }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  return (
    <div className="tiptap-wrapper">
      <EditorToolbar editor={editor} />
      <EditorContent className="tiptap-content" editor={editor} />
    </div>
  );
}

export default TiptapEditor;
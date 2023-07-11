// src/Tiptap.jsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = ({ onChange }) => {
  // useEditor Hook
  const editor = useEditor({
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // This callback is triggered on every content change
    },
  })

  return (
    <EditorContent editor={editor} />
  )
};

export default Tiptap;

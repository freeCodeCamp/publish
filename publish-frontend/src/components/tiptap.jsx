import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import React from 'react';

// Sample code from: https://tiptap.dev/installation/react
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div>
    </div>
  );
};

const Tiptap = ({ onChange, defaultValue }) => {
  // useEditor Hook
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
        }
      }),
      Placeholder.configure({
        // Use a placeholder:
        placeholder: 'Write something …'
      })
    ],
    content: defaultValue ? defaultValue : 'type something',
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // This callback is triggered on every content change
    }
  });

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor}/>
    </>
  );
};

export default Tiptap;

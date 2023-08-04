import { useEditor, EditorContent } from '@tiptap/react';
import React, { useEffect, useRef } from "react";
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Color } from '@tiptap/extension-color';
import BubbleMenu from '@tiptap/extension-bubble-menu'
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';


function MenuBubble({ editor, ref }) {
  return (
    <div className='menu'>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        Bold
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        Italic
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        Strike
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        Code
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
      >
        h1
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
      >
        h2
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
      >
        h3
      </button>
    </div>
  );
}

const Tiptap = ({ onChange, defaultValue }) => {

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
    content: defaultValue ? defaultValue : '',
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none',
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // This callback is triggered on every content change
    }
  });

  return (
    <>
      <MenuBubble editor={editor} /> 
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;

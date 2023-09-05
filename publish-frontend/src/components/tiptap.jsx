import {
  faBold,
  faCode,
  faHeader,
  faImage,
  faItalic,
  faList,
  faListUl,
  faQuoteLeft,
  faStrikethrough
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Prose } from '@nikolovlazar/chakra-ui-prose';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback } from 'react';

function ToolBar({ editor }) {
  const addImage = useCallback(() => {
    const url = window.prompt('URL');

    if (url) {
      editor.chain().focus().setImage({ src: url, alt: '' }).run();
    }
  }, [editor]);

  return (
    <div className='toolbar'>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className='icon-margin'
      >
        <FontAwesomeIcon icon={faBold} />
        <span>Bold</span>
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className='icon-margin'
      >
        <FontAwesomeIcon icon={faItalic} />
        <span>Italic</span>
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className='icon-margin'
      >
        <FontAwesomeIcon icon={faStrikethrough} />
        <span>Strike</span>
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleCode().run()}
        className='icon-margin'
      >
        <FontAwesomeIcon icon={faCode} />
        <span>Code</span>
      </button>
      <button
        type='button'
        className='icon-margin'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <FontAwesomeIcon icon={faQuoteLeft} />
        <span>Quote</span>
      </button>
      <div className='vl'></div>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
      >
        <FontAwesomeIcon icon={faHeader} />1
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
      >
        <FontAwesomeIcon icon={faHeader} />2
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
      >
        <FontAwesomeIcon icon={faHeader} />3
      </button>
      <div className='vl'></div>
      <button
        type='button'
        className='icon-margin'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FontAwesomeIcon icon={faListUl} />
        <span>Bullet</span>
      </button>
      <button
        type='button'
        className='icon-margin'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <FontAwesomeIcon icon={faList} />
        <span>Ordered</span>
      </button>
      <div className='vl'></div>
      <button type='button' className='icon-margin' onClick={() => addImage()}>
        <FontAwesomeIcon icon={faImage} />
        <span>Image</span>
      </button>
    </div>
  );
}

const Tiptap = ({ handleContentChange, defaultValue }) => {
  const editor = useEditor({
    extensions: [
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
      }),
      Image.configure({
        inline: true
      })
    ],
    content: defaultValue ? defaultValue : '',
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none'
      }
    },
    onUpdate: ({ editor }) => {
      console.log('update');
      handleContentChange(editor.getHTML());
    }
  });

  return (
    <>
      <ToolBar editor={editor} />
      <Prose>
        <EditorContent editor={editor} />
      </Prose>
    </>
  );
};

export default Tiptap;

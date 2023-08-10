import { useEditor, EditorContent } from '@tiptap/react';
import { useCallback } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faCode, faHeader, faImage, faItalic, faList, faListUl, faQuoteLeft, faStrikethrough } from '@fortawesome/free-solid-svg-icons';

function MenuBubble({ editor }) {


  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url, alt: '' }).run()
    }
  }, [editor])

  return (
    <div className='menu'>
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
      <div className="vl"></div>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
      >
        <FontAwesomeIcon icon={faHeader} />
        1
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
      >
        <FontAwesomeIcon icon={faHeader} />
        2
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
      >
        <FontAwesomeIcon icon={faHeader} />
        3
      </button>
      <div className="vl"></div>
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
      <div className="vl"></div>
      <button
        type='button'
        className='icon-margin'
        onClick={() => addImage()}
      >
        <FontAwesomeIcon icon={faImage} />
        <span>Image</span>
      </button>
    </div>
  );
}

const Tiptap = ({ onChange, defaultValue }) => {

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
        inline: true,
      })
    ],
    content: defaultValue ? defaultValue : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla malesuada tortor nec purus viverra, ac laoreet nulla hendrerit. Proin ac vehicula lacus. Donec nulla diam, volutpat eu interdum non, pharetra non mi. In tempor nisi augue, vel volutpat lorem gravida id. Quisque sodales augue in aliquet lacinia. Phasellus interdum convallis orci, sollicitudin pharetra enim fringilla eu. Pellentesque suscipit laoreet ante ut luctus. Etiam sagittis massa id magna efficitur volutpat. Aenean id nulla ut tellus porttitor sagittis ac ut nunc. Fusce non velit vitae purus aliquam finibus convallis vitae justo. In pellentesque risus risus, vitae tincidunt augue iaculis eget. Morbi sed risus lobortis, euismod augue sit amet, lobortis sem.

    Nunc vitae enim mauris. Aliquam volutpat dignissim diam, at sodales neque rutrum at. Etiam vestibulum ut orci imperdiet interdum. Duis ut venenatis purus. Aenean ac ultrices sapien. Curabitur sed diam nulla. Nunc ultrices, nisi vitae facilisis dapibus, augue nisi feugiat nisl, id sodales quam libero a sapien. Aliquam dolor justo, gravida rutrum leo in, hendrerit pulvinar elit. Quisque laoreet diam arcu, vel congue quam ullamcorper non. Quisque elit elit, condimentum nec tristique efficitur, lacinia id magna. Donec nec nibh eu nulla vestibulum efficitur. In tempus condimentum tempor. Aliquam eu ligula sed libero aliquam facilisis. Phasellus porttitor accumsan risus dictum placerat. Aenean suscipit velit at odio imperdiet, quis sodales dui molestie.`,
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none',
      }
    },
    onUpdate: ({ editor }) => {
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

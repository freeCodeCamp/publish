import {
  faBold,
  faCode,
  faHeader,
  faImage,
  faItalic,
  faListUl,
  faQuoteLeft,
  faStrikethrough
} from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Prose } from '@nikolovlazar/chakra-ui-prose';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback } from 'react';
import Youtube from '@tiptap/extension-youtube';

function ToolBar({ editor }) {
  const addImage = useCallback(() => {
    const url = window.prompt('URL');

    if (url) {
      editor.chain().focus().setImage({ src: url, alt: '' }).run();
    }
  }, [editor]);

  const addYoutubeEmbed = () => {
    const url = window.prompt('URL');

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480
      });
    }
  };

  return (
    <Box
      display='flex'
      flexDirection='row'
      p='0.2rem'
      marginTop='1rem'
      border='1px solid silver'
      borderRadius='lg'
      overflowX='auto'
    >
      <Button
        p={2}
        iconSpacing={0.5}
        variant='ghost'
        leftIcon={<FontAwesomeIcon icon={faBold} />}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <span>Bold</span>
      </Button>
      <Button
        variant='ghost'
        p={2}
        leftIcon={<FontAwesomeIcon icon={faItalic} />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span>Italic</span>
      </Button>
      <Button
        variant='ghost'
        p={2}
        leftIcon={<FontAwesomeIcon icon={faStrikethrough} />}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span>Strike</span>
      </Button>
      <Button
        variant='ghost'
        p={2}
        leftIcon={<FontAwesomeIcon icon={faCode} />}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <span>Code</span>
      </Button>
      <Button
        variant='ghost'
        p={2}
        leftIcon={<FontAwesomeIcon icon={faQuoteLeft} />}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <span>Quote</span>
      </Button>
      <div className='vl'></div>
      <Button
        variant='ghost'
        p={2}
        leftIcon={<FontAwesomeIcon icon={faHeader} />}
        onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
      >
        1
      </Button>
      <Button
        variant='ghost'
        p={2}
        leftIcon={<FontAwesomeIcon icon={faHeader} />}
        onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
      >
        2
      </Button>
      <Button
        type='button'
        variant='ghost'
        p={2}
        leftIcon={<FontAwesomeIcon icon={faHeader} />}
        onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
      >
        3
      </Button>
      <div className='vl'></div>
      <Button
        variant='ghost'
        p={2}
        leftIcon={<FontAwesomeIcon icon={faListUl} />}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <span>Bullet</span>
      </Button>
      <Button
        variant='ghost'
        p={2}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <span>Ordered</span>
      </Button>
      <div className='vl'></div>
      <Button
        variant='ghost'
        p={2}
        leftIcon={<FontAwesomeIcon icon={faImage} />}
        onClick={() => addImage()}
      >
        <span>Image</span>
      </Button>
      <Menu>
        <MenuButton
          as={Button}
          leftIcon={<FontAwesomeIcon icon={faCode} />}
          variant='ghost'
        >
          Embed
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => addYoutubeEmbed()}>YouTube</MenuItem>
          <MenuItem>Twitter</MenuItem>
        </MenuList>
      </Menu>
    </Box>
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
      }),
      Youtube.configure({
        width: 480,
        height: 320
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

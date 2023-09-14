import {
  faBold,
  faCode,
  faHeader,
  faImage,
  faItalic,
  faListOl,
  faLink,
  faListUl,
  faQuoteLeft,
  faStrikethrough,
  faFileExport
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
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback } from 'react';
import Youtube from '@tiptap/extension-youtube';
import { Markdown } from 'tiptap-markdown';

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

  const addLink = () => {
    const url = window.prompt('URL');

    if (url) {
      editor.commands.setLink({ href: url, target: '_blank' });
    }
  };

  const convertToMarkdown = () => {
    const content = window.prompt('Markdown');

    if (!content) return;

    editor.commands.setContent(content);
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
        iconSpacing={0}
        variant='ghost'
        leftIcon={<FontAwesomeIcon icon={faBold} />}
        onClick={() => editor.chain().focus().toggleBold().run()}
      ></Button>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        leftIcon={<FontAwesomeIcon icon={faItalic} />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      ></Button>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        leftIcon={<FontAwesomeIcon icon={faStrikethrough} />}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      ></Button>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        leftIcon={<FontAwesomeIcon icon={faCode} />}
        onClick={() => editor.chain().focus().toggleCode().run()}
      ></Button>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        leftIcon={<FontAwesomeIcon icon={faQuoteLeft} />}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      ></Button>
      <div className='vl'></div>
      <Menu>
        <MenuButton
          as={Button}
          variant='ghost'
          iconSpacing={0}
          leftIcon={<FontAwesomeIcon icon={faHeader} />}
        ></MenuButton>
        <MenuList>
          <MenuItem
            leftIcon={faHeader}
            onClick={() =>
              editor.chain().focus().setHeading({ level: 1 }).run()
            }
          >
            1
          </MenuItem>
          <MenuItem
            leftIcon={faHeader}
            onClick={() =>
              editor.chain().focus().setHeading({ level: 2 }).run()
            }
          >
            2
          </MenuItem>
          <MenuItem
            leftIcon={faHeader}
            onClick={() =>
              editor.chain().focus().setHeading({ level: 3 }).run()
            }
          >
            3
          </MenuItem>
          <MenuItem
            leftIcon={faHeader}
            onClick={() =>
              editor.chain().focus().setHeading({ level: 4 }).run()
            }
          >
            4
          </MenuItem>
          <MenuItem
            leftIcon={faHeader}
            onClick={() =>
              editor.chain().focus().setHeading({ level: 5 }).run()
            }
          >
            5
          </MenuItem>
          <MenuItem
            leftIcon={faHeader}
            onClick={() =>
              editor.chain().focus().setHeading({ level: 6 }).run()
            }
          >
            6
          </MenuItem>
        </MenuList>
      </Menu>
      <div className='vl'></div>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        leftIcon={<FontAwesomeIcon icon={faListUl} />}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      ></Button>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        leftIcon={<FontAwesomeIcon icon={faListOl} />}
      ></Button>
      <div className='vl'></div>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        leftIcon={<FontAwesomeIcon icon={faImage} />}
        onClick={() => addImage()}
      ></Button>
      <Menu>
        <MenuButton
          as={Button}
          iconSpacing={0}
          leftIcon={<FontAwesomeIcon icon={faCode} />}
          variant='ghost'
        ></MenuButton>
        <MenuList>
          <MenuItem onClick={() => addYoutubeEmbed()}>YouTube</MenuItem>
          <MenuItem>Twitter</MenuItem>
        </MenuList>
      </Menu>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        leftIcon={<FontAwesomeIcon icon={faLink} />}
        onClick={() => addLink()}
      ></Button>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        onClick={() => convertToMarkdown()}
      >
        <FontAwesomeIcon icon={faFileExport} />
      </Button>
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
      }),
      Link.configure({
        protocols: ['http', 'https', 'mailto', 'tel']
      }),
      Markdown.configure({})
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

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
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback } from 'react';
import Youtube from '@tiptap/extension-youtube';
import { Markdown } from 'tiptap-markdown';
import Code from '@tiptap/extension-code';
import Embed from '../../tiptap-extensions/src';

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

  const addTwitterEmbed = () => {
    const id = window.prompt('Tweet ID');

    if (id) {
      editor.commands.setTwitterEmbed({
        tweetId: id.toString()
      });
    }
  };

  const addLink = () => {
    const url = window.prompt('URL');

    if (url) {
      editor.commands.setLink({ href: url, target: '_blank' });
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
        variant='ghost'
        iconSpacing={0}
        p={2}
        title='Bold'
        leftIcon={<FontAwesomeIcon icon={faBold} />}
        onClick={() => editor.chain().focus().toggleBold().run()}
      ></Button>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        title='Italic'
        aria-label='Italic'
        leftIcon={<FontAwesomeIcon icon={faItalic} />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      ></Button>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        title='Strikethrough'
        aria-aria-label='Strikethrough'
        leftIcon={<FontAwesomeIcon icon={faStrikethrough} />}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      ></Button>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        title='Code'
        aria-label='Code'
        leftIcon={<FontAwesomeIcon icon={faCode} />}
        onClick={() => editor.chain().focus().toggleCode().run()}
      ></Button>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        title='Blockquote'
        aria-label='Blockquote'
        leftIcon={<FontAwesomeIcon icon={faQuoteLeft} />}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      ></Button>
      <div className='vl'></div>
      <Menu>
        <MenuButton
          as={Button}
          variant='ghost'
          title='Heading'
          aria-label='Heading'
          iconSpacing={0}
          leftIcon={<FontAwesomeIcon icon={faHeader} />}
        ></MenuButton>
        <MenuList>
          <MenuItem
            leftIcon={faHeader}
            title='Heading 1'
            aria-label='Heading 1'
            onClick={() =>
              editor.chain().focus().setHeading({ level: 1 }).run()
            }
          >
            1
          </MenuItem>
          <MenuItem
            leftIcon={faHeader}
            title='Heading 2'
            aria-label='Heading 2'
            onClick={() =>
              editor.chain().focus().setHeading({ level: 2 }).run()
            }
          >
            2
          </MenuItem>
          <MenuItem
            leftIcon={faHeader}
            title='Heading 3'
            aria-label='Heading 3'
            onClick={() =>
              editor.chain().focus().setHeading({ level: 3 }).run()
            }
          >
            3
          </MenuItem>
          <MenuItem
            leftIcon={faHeader}
            title='Heading 4'
            aria-label='Heading 4'
            onClick={() =>
              editor.chain().focus().setHeading({ level: 4 }).run()
            }
          >
            4
          </MenuItem>
          <MenuItem
            leftIcon={faHeader}
            title='Heading 5'
            aria-label='Heading 5'
            onClick={() =>
              editor.chain().focus().setHeading({ level: 5 }).run()
            }
          >
            5
          </MenuItem>
          <MenuItem
            leftIcon={faHeader}
            title='Heading 6'
            aria-label='Heading 6'
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
        title='Bullet List'
        aria-label='Bullet List'
        leftIcon={<FontAwesomeIcon icon={faListUl} />}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      ></Button>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        title='Ordered List'
        aria-label='Ordered List'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        leftIcon={<FontAwesomeIcon icon={faListOl} />}
      ></Button>
      <div className='vl'></div>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        title='Image'
        aria-label='Image'
        leftIcon={<FontAwesomeIcon icon={faImage} />}
        onClick={() => addImage()}
      ></Button>
      <Menu>
        <MenuButton
          as={Button}
          iconSpacing={0}
          title='Embed'
          aria-label='Embed'
          leftIcon={<FontAwesomeIcon icon={faCode} />}
          variant='ghost'
        ></MenuButton>
        <MenuList>
          <MenuItem onClick={() => addYoutubeEmbed()}>YouTube</MenuItem>
          <MenuItem onClick={() => addTwitterEmbed()}>Twitter</MenuItem>
        </MenuList>
      </Menu>
      <Button
        variant='ghost'
        iconSpacing={0}
        p={2}
        title='Link'
        aria-label='Link'
        leftIcon={<FontAwesomeIcon icon={faLink} />}
        onClick={() => addLink()}
      ></Button>
    </Box>
  );
}

const Tiptap = ({ handleContentChange, content }) => {
  const editor = useEditor({
    extensions: [
      Embed,
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
      Markdown.configure({
        transformPastedText: true
      }),
      Code.configure({
        HTMLAttributes: {
          class: 'code'
        }
      })
    ],
    content: content ? content : '',
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none'
      }
    },
    onUpdate: async ({ editor }) => {
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

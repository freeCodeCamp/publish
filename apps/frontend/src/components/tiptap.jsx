import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import {
  autoUpdate,
  flip,
  hide,
  offset,
  safePolygon,
  shift,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import {
  faBold,
  faCode,
  faFileCode,
  faHeader,
  faImage,
  faItalic,
  faLink,
  faListOl,
  faListUl,
  faQuoteLeft,
  faStrikethrough,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import CharacterCount from "@tiptap/extension-character-count";
import Code from "@tiptap/extension-code";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { BubbleMenu, EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { Markdown } from "tiptap-markdown";

function ToolBar({ editor, user }) {
  const addYoutubeEmbed = () => {
    const url = window.prompt("URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  const addLink = () => {
    const url = window.prompt("URL");

    if (url) {
      editor.commands.setLink({ href: url, target: "_blank" });
    }
  };

  const handleImageSubmit = async (event) => {
    event.preventDefault();

    const apiBase = process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL;

    const formData = new FormData();
    const image = document.getElementById("add-image").files;

    // Handle the case where the user opts not to submit an image.
    if (!image) return;
    formData.append("files", image[0]);

    const res = await fetch(new URL("api/upload", apiBase), {
      method: "post",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt}`,
      },
      body: formData,
    });

    const data = await res.json();

    editor.commands.setImage({
      src: new URL(data[0].url, apiBase),
      alt: "image",
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      p="0.2rem"
      marginTop="1rem"
      border="1px solid silver"
      borderRadius="lg"
      overflowX="auto"
      id="toolbar"
    >
      <Button
        variant="ghost"
        iconSpacing={0}
        p={2}
        title="Add bold text"
        aria-label="Add bold text"
        leftIcon={<FontAwesomeIcon icon={faBold} />}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <Button
        variant="ghost"
        iconSpacing={0}
        p={2}
        title="Add italic text"
        aria-label="Add italic text"
        leftIcon={<FontAwesomeIcon icon={faItalic} />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <Button
        variant="ghost"
        iconSpacing={0}
        p={2}
        title="Add strikethrough text"
        aria-label="Add strikethrough text"
        leftIcon={<FontAwesomeIcon icon={faStrikethrough} />}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <Button
        variant="ghost"
        iconSpacing={0}
        p={2}
        title="Add code"
        aria-label="Add code"
        leftIcon={<FontAwesomeIcon icon={faCode} />}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
      <Button
        variant="ghost"
        iconSpacing={0}
        p={2}
        title="Add blockquote"
        aria-label="Add blockquote"
        leftIcon={<FontAwesomeIcon icon={faQuoteLeft} />}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <div className="vl"></div>
      <Menu>
        <MenuButton
          as={Button}
          variant="ghost"
          title="Select heading text"
          aria-label="Select heading text"
          iconSpacing={0}
          leftIcon={<FontAwesomeIcon icon={faHeader} />}
        />
        <MenuList>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            Heading 1
          </MenuItem>

          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            Heading 2
          </MenuItem>

          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            Heading 3
          </MenuItem>

          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
          >
            Heading 4
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
          >
            Heading 5
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
          >
            Heading 6
          </MenuItem>
        </MenuList>
      </Menu>
      <div className="vl"></div>
      <Button
        variant="ghost"
        iconSpacing={0}
        p={2}
        title="Add a bullet List"
        aria-label="Add a bullet List"
        leftIcon={<FontAwesomeIcon icon={faListUl} />}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <Button
        variant="ghost"
        iconSpacing={0}
        p={2}
        title="Add an ordered List"
        aria-label="Add an ordered List"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        leftIcon={<FontAwesomeIcon icon={faListOl} />}
      />
      <div className="vl"></div>
      <label htmlFor="add-image" className="custom-file-upload">
        <Button
          type="button"
          variant="ghost"
          iconSpacing={0}
          p={2}
          title="Add an image"
          aria-label="Add an image"
          leftIcon={<FontAwesomeIcon icon={faImage} />}
          onClick={() => document.getElementById("add-image").click()}
        />
      </label>
      <form id="choose-image-form" onChange={handleImageSubmit}>
        <input
          type="file"
          id="add-image"
          accept="image/*"
          style={{ display: "none" }}
        />{" "}
      </form>
      <Menu>
        <MenuButton
          as={Button}
          iconSpacing={0}
          title="Select embed content"
          aria-label="Select embed content"
          leftIcon={<FontAwesomeIcon icon={faFileCode} />}
          variant="ghost"
        />
        <MenuList>
          <MenuItem onClick={() => addYoutubeEmbed()}>YouTube</MenuItem>
        </MenuList>
      </Menu>
      <Button
        variant="ghost"
        iconSpacing={0}
        p={2}
        title="Add a link"
        aria-label="Add a link"
        leftIcon={<FontAwesomeIcon icon={faLink} />}
        onClick={() => addLink()}
      />
    </Box>
  );
}

function BubbleMenuBar({ editor, isLinkHover }) {
  const addLink = () => {
    const url = window.prompt("URL");

    if (url) {
      editor.commands.setLink({ href: url, target: "_blank" });
    }
  };

  return (
    <BubbleMenu editor={editor}>
      <Box
        display={isLinkHover ? "none" : "flex"}
        flexDirection="row"
        p="0.2rem"
        marginTop="1rem"
        border="1px solid silver"
        borderRadius="lg"
        overflowX="auto"
        id="bubble-menu"
        background="white"
      >
        <Button
          variant="ghost"
          iconSpacing={0}
          p={2}
          title="Add bold text"
          aria-label="Add bold text"
          leftIcon={<FontAwesomeIcon icon={faBold} />}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <Button
          variant="ghost"
          iconSpacing={0}
          p={2}
          title="Add italic text"
          aria-label="Add italic text"
          leftIcon={<FontAwesomeIcon icon={faItalic} />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <Button
          variant="ghost"
          iconSpacing={0}
          p={2}
          title="Add a link"
          aria-label="Add a link"
          leftIcon={<FontAwesomeIcon icon={faLink} />}
          onClick={() => addLink()}
        />
      </Box>
    </BubbleMenu>
  );
}

const Tiptap = ({ handleContentChange, user, content }) => {
  const [link, setLink] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const editorRef = useRef(null);

  const { refs, floatingStyles, context, elements, update, middlewareData } =
    useFloating({
      placement: "top",
      middleware: [
        offset(10),
        flip({
          boundary: editorRef.current,
        }),
        shift({ padding: 10 }),
        hide({
          boundary: editorRef.current,
        }),
      ],
      whileElementsMounted: autoUpdate,
      open: isOpen,
      onOpenChange: setIsOpen,
    });

  const hover = useHover(context, {
    handleClose: safePolygon(),
  });

  const { getFloatingProps } = useInteractions([hover]);

  useEffect(() => {
    if (isOpen && elements.reference && elements.floating) {
      const cleanup = autoUpdate(elements.reference, elements.floating, update);
      return cleanup;
    }
  }, [isOpen, elements, update]);

  const HoverBar = Extension.create({
    name: "hover-bar",

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey("hover-bar"),
          props: {
            handleDOMEvents: {
              mouseover: (view, event) => {
                const target = event.target;
                const pos = view.posAtDOM(target, 0);

                if (pos === null) return false;

                const node = view.state.doc.nodeAt(pos);
                if (!node || !node.isAtom) return false;

                if (
                  target.tagName.toLowerCase() === "a" &&
                  node.marks[0]?.type.name === "link"
                ) {
                  const href = node.marks[0]?.attrs.href;
                  console.log(event.target);
                  setLink(href);
                  // setIsLinkHover(true);
                  refs.setReference(event.target);
                } else {
                  console.log("out of link");
                  // setIsLinkHover(false);
                }
              },
            },
          },
        }),
      ];
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        // Use a placeholder:
        placeholder: "Write something …",
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: "add-image-form",
        },
      }),
      Youtube.configure({
        width: 480,
        height: 320,
      }),
      Link.configure({
        protocols: ["http", "https", "mailto", "tel"],
      }),
      Markdown.configure({
        transformPastedText: true,
      }),
      Code.configure({
        HTMLAttributes: {
          class: "code",
        },
      }),
      CharacterCount.configure({}),
      HoverBar.configure({}),
    ],
    content: content ? content : "",
    autofocus: true,
    editorProps: {
      attributes: {
        class: "prose focus:outline-none",
        "data-testid": "editor",
      },
    },
    onUpdate: ({ editor }) => {
      handleContentChange(editor.getHTML());
    },
  });

  const words = editor?.storage.characterCount.words();

  return (
    <>
      <ToolBar editor={editor} user={user} />
      {editor && <BubbleMenuBar editor={editor} isLinkHover={isOpen} />}
      {isOpen && (
        <Box
          p="0.2rem"
          border="1px solid silver"
          borderRadius="lg"
          overflowX="auto"
          id="bubble-menu"
          background="white"
          width="fit-content"
          visibility={
            middlewareData.hide?.referenceHidden ? "hidden" : "visible"
          }
          zIndex={99999}
          display="flex"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <p
            style={{
              maxWidth: "28rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {link}
          </p>
          <Button
            variant="ghost"
            iconSpacing={0}
            p={2}
            title="Add bold text"
            aria-label="Add bold text"
            leftIcon={<FontAwesomeIcon icon={faBold} />}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <Button
            variant="ghost"
            iconSpacing={0}
            p={2}
            title="Add italic text"
            aria-label="Add italic text"
            leftIcon={<FontAwesomeIcon icon={faItalic} />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
        </Box>
      )}
      <div ref={editorRef}>
        <Prose>
          <EditorContent editor={editor} id="editor" />
        </Prose>
      </div>
      <Box right="50px" bottom="50px" zIndex="1" position="fixed">
        <Text
          fontSize="xl"
          opacity={0.6}
          data-testid="word-count"
          padding="0.5rem"
        >
          {words === 1 ? `${words} word` : `${words} words`}
        </Text>
      </Box>
    </>
  );
};

export default Tiptap;

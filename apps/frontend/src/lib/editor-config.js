import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import { Markdown } from "tiptap-markdown";
import { lowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

export const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
    codeBlock: false,
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
    protocols: ["http", "https", "mailto", "tel"],        autolink: false,
    openOnClick: false,
  }),
  Markdown.configure({
    transformPastedText: true,
  }),
  CodeBlockLowlight.configure({
    defaultLanguage: "javascript",
    lowlight,
  }),
  CharacterCount.configure({}),
];

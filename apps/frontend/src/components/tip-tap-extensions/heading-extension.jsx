import BaseHeading from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/core";

export const Heading = BaseHeading.configure({
  levels: [1, 2, 3, 4, 5, 6],
}).extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels[0];

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        id: node.textContent.split(" ").join("-").toLowerCase(),
      }),
      0,
    ];
  },
});

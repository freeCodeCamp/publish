import BaseHeading from "@tiptap/extension-heading";
import slugify from "slugify";

export const Heading = BaseHeading.configure({
  levels: [1, 2, 3, 4, 5, 6],
}).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => ({
          id: slugify(element.textContent, {
            lower: true,
          }),
        }),
        renderHTML: (attributes) => ({
          id: attributes.id,
        }),
      },
    };
  },

  onSelectionUpdate({ editor }) {
    const { $from } = editor.state.selection;

    // This line gets the node at the depth of
    // the start of the selection. If the selection
    // starts in a heading, this will be the heading node.

    const node = $from.node($from.depth);

    if (node.type.name === "heading") {
      editor.commands.updateAttributes("heading", {
        id: slugify(node.textContent, {
          lower: true,
        }),
      });
    }
  },

  renderHTML({ node }) {
    return [
      "h" + node.attrs.level,
      {
        id: slugify(node.textContent, {
          lower: true,
        }),
      },
      0,
    ];
  },
});

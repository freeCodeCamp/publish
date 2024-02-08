import BaseHeading from "@tiptap/extension-heading";

export const Heading = BaseHeading.configure({
  levels: [1, 2, 3, 4, 5, 6],
}).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => ({
          id: element.textContent.split(" ").join("-").toLowerCase(),
        }),
        renderHTML: (attributes) => ({
          id: attributes.id,
        }),
      },
    };
  },

  onSelectionUpdate({ editor }) {
    const { $from } = editor.state.selection;
    const node = $from.node($from.depth);

    if (node.type.name === "heading") {
      editor.commands.updateAttributes("heading", {
        id: node.textContent.split(" ").join("-").toLowerCase(),
      });
    }
  },

  renderHTML({ node }) {
    return [
      "h" + node.attrs.level,
      { id: node.textContent.replace(/\s+/g, "-").toLowerCase() },
      0,
    ];
  },
});

import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

function ImageNode(props) {
  // importing caption as the title for now
  const { src, alt, title } = props.node.attrs;

  let className = "image add-image-form";

  console.log(props.node);

  if (props.selected) {
    className += " ProseMirror-selectednode";
  }

  return (
    <NodeViewWrapper className={className}>
      <figure>
        <img src={src} alt={alt} title={title} />
        <figcaption>{title}</figcaption>
      </figure>
    </NodeViewWrapper>
  );
}

export default Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageNode);
  },
});

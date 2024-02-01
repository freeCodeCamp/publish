import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useDisclosure,
  Spacer,
} from "@chakra-ui/react";
import { useRef } from "react";

function UpdateModalAttributes({ isOpen, onClose, finalRef }) {
  // const [currentAlt, setCurrentAlt] = useState(null);
  // const [currentCaption, setCurrentCaption] = useState(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={finalRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Image</ModalHeader>
        <ModalCloseButton />
        <form>
          <ModalBody pb={6}>
            <Input
              type="text"
              name="alt"
              placeholder="Alternative Text"
              onChange={(event) => setCurrentAlt(event.target.value)}
              required
            />
            <Spacer height="1rem" width="100%" />
            <Input
              type="text"
              name="caption"
              placeholder="Caption"
              onChange={(event) => setCurrentCaption(event.target.value)}
              required
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit" disabled={true}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

function ImageNode(props) {
  // importing caption as the title for now
  const { src, alt, title } = props.node.attrs;

  //const { updateAttributes } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);

  let className = "image add-image-form";

  console.log(props.node);

  if (props.selected) {
    className += " ProseMirror-selectednode";
  }

  return (
    <NodeViewWrapper className={className}>
      <figure onClick={onOpen}>
        <img src={src} alt={alt} title={title} />
        <figcaption>{title}</figcaption>
      </figure>
      <UpdateModalAttributes
        isOpen={isOpen}
        onClose={onClose}
        finalRef={finalRef}
      />
    </NodeViewWrapper>
  );
}

export default Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageNode);
  },
});

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
  Img,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

function UpdateModalAttributes({
  isOpen,
  onClose,
  finalRef,
  incAlt,
  incCap,
  updateAndRerender,
}) {
  const [currentAlt, setCurrentAlt] = useState(incAlt);
  const [currentCaption, setCurrentCaption] = useState(incCap);

  const submitFileInfo = async () => {
    updateAndRerender({
      alt: currentAlt,
      title: currentCaption,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={finalRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Image</ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitFileInfo();
          }}
        >
          <ModalBody pb={6}>
            <Input
              type="text"
              name="alt"
              placeholder="Alternative Text"
              value={currentAlt}
              onChange={(event) => setCurrentAlt(event.target.value)}
              required
            />
            <Spacer height="1rem" width="100%" />
            <Input
              type="text"
              name="caption"
              placeholder="Caption"
              value={currentCaption}
              onChange={(event) => setCurrentCaption(event.target.value)}
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);

  const updateAndRerender = (newAttrs) => {
    props.updateAttributes(newAttrs);
  };

  let className = "image add-image-form";

  if (props.selected) {
    className += " ProseMirror-selectednode";
  }

  return (
    <NodeViewWrapper className={className}>
      <figure onClick={onOpen}>
        <Img src={src} alt={alt} />
        <figcaption>{title}</figcaption>
      </figure>
      <UpdateModalAttributes
        isOpen={isOpen}
        onClose={onClose}
        finalRef={finalRef}
        incAlt={alt}
        incCap={title}
        updateAndRerender={updateAndRerender}
      />
    </NodeViewWrapper>
  );
}

export default Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageNode);
  },
});

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
  useToast,
  Spacer,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

function UpdateModalAttributes({
  isOpen,
  onClose,
  finalRef,
  incAlt,
  incCap,
  updateAndRerender,
  id,
  jwt,
  save,
}) {
  const [currentAlt, setCurrentAlt] = useState(incAlt);
  const [currentCaption, setCurrentCaption] = useState(incCap);

  const toast = useToast();

  const apiBase = process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL;

  const submitFileInfo = async () => {
    const form = new FormData();

    const fileInfo = {
      alternativeText: currentAlt,
      caption: currentCaption,
    };

    form.append("fileInfo", JSON.stringify(fileInfo));

    const updatedFileInfo = await fetch(
      new URL(`api/upload?id=${id}`, apiBase),
      {
        method: "post",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: form,
      },
    );

    if (updatedFileInfo.status === 200) {
      console.log("updated file info");
      updateAndRerender({
        alt: currentAlt,
        title: currentCaption,
      });
      save();
      onClose();
    } else {
      toast({
        title: "Error",
        description: "There was an error uploading your image",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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
  const { src, alt, id, title, jwt, save } = props.node.attrs;

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
        <img src={src} alt={alt} title={title} />
        <figcaption>{title}</figcaption>
      </figure>
      <UpdateModalAttributes
        isOpen={isOpen}
        onClose={onClose}
        finalRef={finalRef}
        incAlt={alt}
        id={id}
        jwt={jwt}
        incCap={title}
        updateAndRerender={updateAndRerender}
        save={save}
      />
    </NodeViewWrapper>
  );
}

export default Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageNode);
  },
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      id: {
        default: null,
      },
      jwt: {
        default: null,
      },
      save: {
        default: null,
      },
    };
  },
});

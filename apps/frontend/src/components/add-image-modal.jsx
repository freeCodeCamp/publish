import React, { useState } from "react";
import { Formik } from "formik";
import {
  Box,
  Button,
  Img,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from "@chakra-ui/react";

export default function ImageModal({
  isOpen,
  onClose,
  finalRef,
  editor,
  user,
}) {
  const [currentImg, setCurrentImage] = useState(null);
  //const [currentAlt, setCurrentAlt] = useState(null);

  const handleImagePreview = (event) => {
    setCurrentImage(URL.createObjectURL(event.target.files[0]));
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
    <>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add an Image</ModalHeader>
          <ModalCloseButton />
          <Formik
            onSubmit={(event) => {
              handleImageSubmit(event);
              onClose();
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <Box
                    display="flex"
                    borderWidth="1px"
                    borderRadius="lg"
                    w="100%"
                    h="175px"
                    overflow="hidden"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {currentImg ? (
                      <Img src={currentImg} alt="preview" />
                    ) : (
                      <>
                        <label
                          htmlFor="feature-image"
                          className="custom-file-upload"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              document.getElementById("content-image").click()
                            }
                          >
                            Select Image
                          </button>
                        </label>
                        <Input
                          type="file"
                          id="content-image"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleImagePreview}
                        />{" "}
                      </>
                    )}
                  </Box>
                  {currentImg && (
                    <>
                      <Spacer height="1rem" width="100%" />
                      <Button
                        colorScheme="red"
                        width="100%"
                        onClick={() => setCurrentImage(null)}
                      >
                        Remove Image
                      </Button>
                    </>
                  )}
                  <Spacer height="1rem" width="100%" />
                  <Input type="text" placeholder="Alternative Text" required />
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    _disabled={!currentImg}
                    type="submit"
                    disabled={true}
                  >
                    Save
                  </Button>
                  <Button
                    colorScheme="red"
                    ml={3}
                    onClick={() => {
                      setCurrentImage(null);
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </form>
            )}
          </Formik>
          <Spacer height="1rem" width="100%" />
        </ModalContent>
      </Modal>
    </>
  );
}

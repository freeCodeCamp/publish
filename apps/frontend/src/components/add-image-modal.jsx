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
  // Image preview state
  const [currentImg, setCurrentImage] = useState(null);
  const [_, setCurrentAlt] = useState(null);
  const [submitableImage, setSubmitableImage] = useState(null);

  const handleImagePreview = (event) => {
    setCurrentImage(URL.createObjectURL(event.target.files[0]));
    setSubmitableImage(event.target.files);
  };

  const handleImageSubmit = async (event) => {
    event.preventDefault();

    const apiBase = process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL;

    const formData = new FormData();

    // Handle the case where the user opts not to submit an image.
    if (!submitableImage) return;
    formData.append("files", submitableImage[0]);

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

    setCurrentImage(null);
    setCurrentAlt("");

    onClose();
  };

  return (
    <>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add an Image</ModalHeader>
          <ModalCloseButton />
          <Formik>
            {({}) => (
              <form
                onSubmit={(event) => {
                  handleImageSubmit(event);
                }}
              >
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
                          htmlFor="content-image"
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
                  <Input
                    type="text"
                    placeholder="Alternative Text"
                    onChange={(event) => {
                      setCurrentAlt(event);
                    }}
                    required
                  />
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" type="submit" disabled={true}>
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

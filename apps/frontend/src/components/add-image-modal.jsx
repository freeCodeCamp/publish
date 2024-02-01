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
  useToast,
} from "@chakra-ui/react";

export default function ImageModal({
  isOpen,
  onClose,
  finalRef,
  editor,
  user,
  handleSubmit,
}) {
  // Image preview state
  const [currentImg, setCurrentImage] = useState(null);
  const [currentAlt, setCurrentAlt] = useState(null);
  const [currentCaption, setCurrentCaption] = useState(null);
  const [submitableImage, setSubmitableImage] = useState(null);

  const toast = useToast();

  const handleImagePreview = (event) => {
    setCurrentImage(URL.createObjectURL(event.target.files[0]));
    setSubmitableImage(event.target.files);
  };

  const submitFileInfo = async (fileId, apiBase) => {
    const form = new FormData();

    const fileInfo = {
      alternativeText: currentAlt,
      caption: currentCaption,
    };

    form.append("fileInfo", JSON.stringify(fileInfo));

    const updatedFileInfo = await fetch(
      new URL(`api/upload?id=${fileId}`, apiBase),
      {
        method: "post",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user.jwt}`,
        },
        body: form,
      },
    );

    if (updatedFileInfo.status === 200) {
      return await updatedFileInfo.json();
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

  const handleImageSubmit = async (event) => {
    event.preventDefault();

    const apiBase = process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL;

    const formData = new FormData();

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

    if (res.status === 200) {
      const data = await res.json();

      submitFileInfo(data[0].id, apiBase);

      editor.commands.setImage({
        src: new URL(data[0].url, apiBase),
        alt: currentAlt,
        title: currentCaption,
        id: data[0].id,
        jwt: user.jwt,
        save: handleSubmit,
      });

      handleSubmit();
      setCurrentImage(null);
      setCurrentAlt("");
      setCurrentCaption("");

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
                      setCurrentAlt(event.target.value);
                    }}
                    required
                  />
                  <Spacer height="1rem" width="100%" />
                  <Input
                    type="text"
                    placeholder="Caption"
                    onChange={(event) => {
                      setCurrentCaption(event.target.value);
                    }}
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

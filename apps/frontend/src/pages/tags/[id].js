import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  chakra,
  useDisclosure,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Form, Formik } from "formik";
import { getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import slugify from "slugify";

import NavMenu from "@/components/nav-menu";
import { deleteTag, getTag, updateTag } from "@/lib/tags";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const Icon = chakra(FontAwesomeIcon);

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const tag = await getTag(session.user.jwt, context.params.id);

  return {
    props: {
      tag: tag.data,
      user: session.user,
    },
  };
}

export default function EditTag({ tag, user }) {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const bg = useColorModeValue("gray.200", "gray.700");
  const container = useColorModeValue("white", "gray.800");

  const [tagData, setTagData] = useState({
    name: tag.attributes.name,
    slug: tag.attributes.slug,
    isInternal: tag.attributes.visibility === "internal",
  });

  const validateNameField = (value) => {
    let error;

    if (!value) {
      error = "You must specify a name for the tag.";
    }

    return error;
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    if (name === "isInternal") {
      setTagData({
        ...tagData,
        [name]: checked,
      });
    } else {
      setTagData({
        ...tagData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    const token = user.jwt;
    const data = {
      data: {
        name: tagData.name,
        slug: slugify(tagData.slug, {
          lower: true,
          strict: true,
        }),
        visibility: tagData.isInternal ? "internal" : "public",
      },
    };

    try {
      await updateTag(token, tag.id, data);
      toast({
        title: "Tag Updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/tags");
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    const token = user.jwt;

    try {
      await deleteTag(token, tag.id);
      toast({
        title: "Tag Deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.replace("/tags");
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bgColor={bg}>
      <NavMenu user={user} />

      <Box ml={{ base: 0, md: "300px" }} px="6">
        <Flex
          alignItems="center"
          minH="20"
          position={{ md: "sticky" }}
          top="0"
          bgColor={bg}
          zIndex="999"
        >
          <Breadcrumb separator={<Icon icon={faChevronRight} fixedWidth />}>
            <BreadcrumbItem>
              <BreadcrumbLink textDecoration="none" href="/tags">
                <Heading size="lg">Tags</Heading>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>
                <Heading size="lg">{tagData.name}</Heading>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>

        <Box p="4" pb="6" bgColor={container} rounded="4" boxShadow="md">
          <Formik
            initialValues={tagData}
            enableReinitialize={true}
            onSubmit={async (_values, _actions) => {
              await handleSubmit();
            }}
          >
            {({ isSubmitting, setSubmitting }) => (
              <Form>
                <Field name="name" validate={validateNameField}>
                  {({ field, form }) => (
                    <FormControl pb="8" isInvalid={form.errors.name}>
                      <FormLabel>Name</FormLabel>
                      <Input {...field} onChange={handleChange} />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="slug">
                  {({ field }) => (
                    <FormControl pb="8">
                      <FormLabel htmlFor="slug">Slug</FormLabel>
                      <Input {...field} onChange={handleChange} />
                    </FormControl>
                  )}
                </Field>
                <Field name="isInternal">
                  {({ field }) => (
                    <FormControl pb="8">
                      <Checkbox
                        {...field}
                        onChange={handleChange}
                        isChecked={tagData.isInternal}
                      >
                        Internal Tag
                      </Checkbox>
                    </FormControl>
                  )}
                </Field>
                <Button
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  type="submit"
                  mr="4"
                >
                  Save
                </Button>
                <Button
                  colorScheme="red"
                  isLoading={isSubmitting}
                  onClick={onOpen}
                >
                  Delete tag
                </Button>
                <AlertDialog
                  isOpen={isOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        Are you sure you want to delete this tag?
                      </AlertDialogHeader>
                      <AlertDialogBody>
                        You{"'"}re about to delete <b>{`"${tagData.name}"`}</b>.
                        This is permanent!
                      </AlertDialogBody>
                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          Cancel
                        </Button>
                        <Button
                          colorScheme="red"
                          isLoading={isSubmitting}
                          onClick={async () => {
                            setSubmitting(true);
                            await handleDelete();
                          }}
                          ml={3}
                        >
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
}

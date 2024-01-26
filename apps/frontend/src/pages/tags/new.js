import {
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
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import slugify from "slugify";

import NavMenu from "@/components/nav-menu";
import { createTag } from "@/lib/tags";

const Icon = chakra(FontAwesomeIcon);

export default function CreateTag() {
  const router = useRouter();
  const toast = useToast();

  const bg = useColorModeValue("gray.200", "gray.700");
  const container = useColorModeValue("white", "gray.800");

  const { data: session } = useSession();
  const user = session?.user;

  const [tagData, setTagData] = useState({
    name: "",
    slug: "",
    isInternal: false,
  });
  const [customSlug, setCustomSlug] = useState(false);

  const validateNameField = (value) => {
    let error;

    if (!value) {
      error = "You must specify a name for the tag.";
    }

    return error;
  };

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    if (name === "name") {
      if (customSlug) {
        setTagData({
          ...tagData,
          [name]: value,
        });
      } else {
        setTagData({
          ...tagData,
          [name]: value,
          slug: slugify(value, {
            lower: true,
            strict: true,
          }),
        });
      }
    } else if (name === "slug") {
      setCustomSlug(true);
      setTagData({
        ...tagData,
        [name]: value,
      });
    } else {
      setTagData({
        ...tagData,
        [name]: checked,
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
        posts: [],
        visibility: tagData.isInternal ? "internal" : "public",
      },
    };

    try {
      await createTag(token, data);
      toast({
        title: "Tag Created.",
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

  if (session) {
    return (
      <Box minH="100vh" bgColor={bg}>
        <NavMenu user={user} />
        <Box ml={{ base: 0, md: "300px" }} px="6">
          <Flex
            alignItems="center"
            minH="20"
            position={{ md: "sticky" }}
            top="0"
            zIndex="9999"
          >
            <Breadcrumb separator={<Icon icon={faChevronRight} fixedWidth />}>
              <BreadcrumbItem>
                <BreadcrumbLink textDecoration="none" href="/tags">
                  <Heading size="lg">Tags</Heading>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>
                  <Heading size="lg">New Tags</Heading>
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
              {({ isSubmitting }) => (
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
                  >
                    Save
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Box>
    );
  }
}

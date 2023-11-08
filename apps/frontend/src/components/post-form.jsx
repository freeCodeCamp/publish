import { useCallback, useEffect, useState } from "react";
import Tiptap from "@/components/tiptap";
import EditorDrawer from "@/components/editor-drawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronLeft,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import {
  Flex,
  Box,
  Button,
  Text,
  Input,
  Stack,
  FormControl,
  FormErrorMessage,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
  RadioGroup,
  Radio,
  Spacer,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { updatePost } from "@/lib/posts";
import { useToast } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

const PostForm = ({ tags, user, authors, post }) => {
  const toast = useToast();
  const router = useRouter();

  const { onClose, onOpen, isOpen } = useDisclosure();

  const [title, setTitle] = useState("(UNTITLED)");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [author, setAuthor] = useState("");

  const [postUrl, setPostUrl] = useState("");
  const [postId, setPostId] = useState("");

  const [postTagId, setPostTagId] = useState([]);

  const [content, setContent] = useState(post?.attributes.body || "");

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  useEffect(() => {
    if (post) {
      const { title, body, slug, tags } = post.attributes;
      const tagIds = tags.data.map((tag) => tag.id);

      setTitle(title);
      setContent(body);

      setPostUrl(slug ?? "");
      setPostId(post.id);
      setPostTagId(tagIds);
    }
  }, [post]);

  const handlePostUrlChange = (value) => {
    setPostUrl(value);
    setUnsavedChanges(true);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setUnsavedChanges(true);
  };

  const handleUnsavedChanges = () => {
    setUnsavedChanges(true);
  };

  const handlePostTagId = (value) => {
    setPostTagId([...value]);
    setUnsavedChanges(true);
  };

  const handleAuthorChange = (author) => {
    setAuthor(author);
    setUnsavedChanges(true);
  };

  const handleSchedule = () => {
    if (scheduledDate == "" || scheduledTime == "") {
      return null;
    } else {
      return scheduledDate + "T" + scheduledTime + ":00.000Z";
    }
  };

  const handleSubmit = useCallback(async () => {
    const nonce = uuidv4();
    const token = user.jwt;

    const data = {
      data: {
        title: title,
        slug: slugify(
          postUrl != "" ? postUrl : title != "(UNTITLED)" ? title : nonce,
          {
            lower: true,
            specialChar: false,
          },
        ),
        body: content,
        tags: postTagId,
        author: [author != "" ? author : user.id],
        locale: "en",
      },
    };

    if (scheduledDate != "" && scheduledTime != "") {
      data.data.scheduled_at = handleSchedule();
    }

    console.log(data);

    try {
      await updatePost(postId, data, token);
      toast({
        title: "Post Updated.",
        description: "We've updated your post for you.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setUnsavedChanges(false);
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast, title, postUrl, postTagId, content, author, postId, user]);

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleSubmit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit]);

  // prompt the user if they try and leave with unsaved changes
  useEffect(() => {
    const warningText =
      "You have unsaved changes - are you sure you wish to leave this page?";

    // handle the user closing the window

    const handleWindowClose = (event) => {
      if (!unsavedChanges) return;
      event.preventDefault();
      return (event.returnValue = warningText);
    };

    // handle the user navigating to a new page via next/router

    const handleRouteChange = () => {
      if (!unsavedChanges) return;
      if (window.confirm(warningText)) return;
      router.events.emit("routeChangeError");
      throw "routeChange aborted.";
    };

    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [unsavedChanges, router.events]);

  function handleContentChange(content) {
    setContent(content);

    if (!unsavedChanges) {
      setUnsavedChanges(true);
    }
  }

  return (
    <>
      <Flex>
        <Flex flexDirection="column" mr="1rem" maxWidth="100%" flex="4">
          <Flex m="1rem 0 0 5rem">
            <Box>
              <Button
                variant="link"
                as={NextLink}
                href="/posts/"
                leftIcon={<FontAwesomeIcon size="lg" icon={faChevronLeft} />}
              >
                <Text fontSize="2xl">Posts</Text>
              </Button>
            </Box>
            <Box ml="auto">
              <Menu isOpen={isOpen} onClose={onClose}>
                <MenuButton
                  onClick={onOpen}
                  as={Button}
                  colorScheme="blue"
                  variant={"ghost"}
                  disabled={!unsavedChanges}
                  rightIcon={<FontAwesomeIcon icon={faChevronDown} />}
                >
                  Publish
                </MenuButton>
                <MenuList w={"300px"}>
                  <Box m={"0.75rem"}>
                    <Text fontSize="lg" color="gray.500">
                      Ready to publish your post?
                    </Text>
                  </Box>
                  <MenuDivider />
                  <RadioGroup m={"1rem 0rem 0 1rem"}>
                    <Stack direction={"column"}>
                      <Radio
                        colorScheme="blue"
                        onClick={handleSubmit}
                        value="now"
                      >
                        <Text
                          fontWeight={"500"}
                          color={"gray.600"}
                          fontSize={"sm"}
                        >
                          Set it live now
                        </Text>
                      </Radio>
                      <Text fontSize={"sm"} ml={"1.5rem"} color={"gray.500"}>
                        Post this post immediately
                      </Text>
                      <Spacer />
                      <Radio
                        colorScheme="blue"
                        onClick={handleSubmit}
                        value="later"
                      >
                        <Text
                          fontWeight={"500"}
                          color={"gray.600"}
                          fontSize={"sm"}
                        >
                          Schedule it for Later
                        </Text>
                      </Radio>
                      <Stack direction={"row"} ml={"1.5rem"} pr={"1rem"}>
                        <Input
                          type={"date"}
                          size="sm"
                          onChange={(e) => setScheduledDate(e.target.value)}
                        />
                        <Input
                          type={"time"}
                          size="sm"
                          onChange={(e) => setScheduledTime(e.target.value)}
                        />
                      </Stack>
                      <Text fontSize={"sm"} ml={"1.5rem"} color={"gray.500"}>
                        Set automatic future publish date
                      </Text>
                    </Stack>
                  </RadioGroup>

                  <MenuDivider />
                  <Flex justifyContent={"end"} mt={"1rem"}>
                    <Button
                      mr="1rem"
                      variant={"ghost"}
                      color="gray.500"
                      fontWeight={"400"}
                      size="sm"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={handleSubmit}
                      mr="1rem"
                      size="sm"
                    >
                      Publish
                    </Button>
                  </Flex>
                </MenuList>
              </Menu>
            </Box>
            <EditorDrawer
              tags={tags}
              authors={authors}
              user={user}
              post={post}
              postTagId={postTagId}
              title={title}
              postUrl={postUrl}
              handleTitleChange={handleTitleChange}
              handlePostUrlChange={handlePostUrlChange}
              handleAuthorChange={handleAuthorChange}
              handleUnsavedChanges={handleUnsavedChanges}
              handlePostTagId={handlePostTagId}
              handleSubmit={handleSubmit}
            />
          </Flex>
          <Flex m="1rem 0 0 5rem" flexDir={{ base: "column", lg: "row" }}>
            {!isEditingTitle ? (
              <>
                <Stack direction="row" onClick={() => setIsEditingTitle(true)}>
                  <Text fontSize="2xl">{title}</Text>
                  <Text fontSize="2xl">
                    <FontAwesomeIcon icon={faEdit} />
                  </Text>
                </Stack>
              </>
            ) : (
              <Formik
                initialValues={{ title: title }}
                onSubmit={(values, actions) => {
                  setTitle(values.title);
                  setIsEditingTitle(false);
                  actions.setSubmitting(false);
                  setUnsavedChanges(true);
                }}
              >
                {(props) => (
                  <Form style={{ width: "100%" }}>
                    <Stack direction={{ base: "column", lg: "row" }}>
                      <Field name="title">
                        {({ field, form }) => (
                          <FormControl
                            w="30%"
                            isInvalid={form.errors.title && form.touched.title}
                          >
                            <Input {...field} placeholder="title" required />
                            <FormErrorMessage>
                              {form.errors.title}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Button
                        colorScheme="blue"
                        isLoading={props.isSubmitting}
                        type="submit"
                        w="15%"
                        margin={{ base: "0 0 1rem 0" }}
                      >
                        Done
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>
            )}
          </Flex>
          <Box p="0 0 0 5rem">
            <Tiptap
              handleContentChange={handleContentChange}
              content={content}
              user={user}
              postId={postId}
            />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};
export default PostForm;

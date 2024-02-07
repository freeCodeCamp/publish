import { useCallback, useEffect, useState } from "react";
import Tiptap from "@/components/tiptap";
import EditorDrawer from "@/components/editor-drawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
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
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { updatePost } from "@/lib/posts";
import { useToast } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { isEditor } from "@/lib/current-user";
import ScheduleMenu from "./schedule-menu";
import { useDebouncedCallback } from "use-debounce";

const PostForm = ({ tags, user, authors, post }) => {
  const toast = useToast();
  const router = useRouter();

  const [title, setTitle] = useState("(UNTITLED)");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [author, setAuthor] = useState("");

  const [postUrl, setPostUrl] = useState("");
  const [postId, setPostId] = useState("");

  const [postTagId, setPostTagId] = useState([]);

  const [content, setContent] = useState(post?.attributes.body || "");

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const [featureImage, setFeatureImageUrl] = useState();
  const [featureImageId, setFeatureImageId] = useState();
  const debouncedContentSave = useDebouncedCallback(
    () => {
      console.log("auto saving post");
      handleSubmit({ isAutoSave: true });
    },
    3000,
    { maxWait: 5000 },
  );

  useEffect(() => {
    if (post) {
      const apiBase = process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL;
      const { title, body, slug, tags, feature_image } = post.attributes;
      const tagIds = tags.data.map((tag) => tag.id);

      setTitle(title);
      setContent(body);

      setPostUrl(slug ?? "");
      setPostId(post.id);
      setPostTagId(tagIds);

      if (feature_image.data) {
        setFeatureImageUrl(
          new URL(feature_image.data.attributes.formats.thumbnail.url, apiBase),
        );
        setFeatureImageId(feature_image.data.id);
      }
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

  const handlePostTagId = useCallback((value) => {
    setPostTagId([...value]);
    setUnsavedChanges(true);
  }, []);

  const handleAuthorChange = (author) => {
    setAuthor(author);
    setUnsavedChanges(true);
  };

  const handleFeatureImageChange = (url, id) => {
    setFeatureImageUrl(url);
    setFeatureImageId(id);
    setUnsavedChanges(true);
  };

  const handleSubmit = useCallback(
    async ({
      shouldPublish = null,
      scheduledDate = "",
      scheduledTime = "",
      isAutoSave = false,
    } = {}) => {
      const nonce = uuidv4();
      const token = user.jwt;

      const data = {
        data: {
          title: title,
          feature_image: featureImageId ? [featureImageId] : null,
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

      const handleSchedule = () => {
        if (scheduledDate == "" || scheduledTime == "") {
          return null;
        } else {
          return scheduledDate + "T" + scheduledTime + ":00.000Z";
        }
      };

      const getTitle = () => {
        if (shouldPublish === "now") {
          return "Post has been published.";
        }

        if (shouldPublish === "later") {
          return "Post has been scheduled.";
        }

        if (shouldPublish === "unpublished") {
          return "Post has been unpublished.";
        }

        return "Post has been updated.";
      };

      if (shouldPublish === "unpublished") {
        data.data.publishedAt = null;
        data.data.scheduled_at = null;
      }

      if (shouldPublish === "later") {
        data.data.scheduled_at = handleSchedule();
      }

      if (shouldPublish == "now") {
        data.data.publishedAt = new Date().toISOString();
        data.data.scheduled_at = null;
      }
      try {
        await updatePost(postId, data, token);
        if (!isAutoSave) {
          toast({
            title: getTitle(),
            description: `The post ${
              shouldPublish != null ? "status" : ""
            } has been updated.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
        debouncedContentSave.cancel();
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
    },
    [
      toast,
      title,
      postUrl,
      postTagId,
      featureImageId,
      content,
      author,
      postId,
      user,
      debouncedContentSave,
    ],
  );

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
    debouncedContentSave(content);

    if (!unsavedChanges) {
      setUnsavedChanges(true);
    }
  }

  return (
    <>
      <Flex
        flexDirection="column"
        m="0 1rem"
        h="100vh"
        maxWidth="100%"
        flex="4"
      >
        <Flex m="1rem auto 0 auto" w="100%">
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
          <Box ml="auto" display={"flex"}>
            {isEditor(user) && (
              <ScheduleMenu handleSubmit={handleSubmit} post={post} />
            )}
            <EditorDrawer
              tags={tags}
              authors={authors}
              user={user}
              post={post}
              postTagId={postTagId}
              title={title}
              postUrl={postUrl}
              featureImage={featureImage}
              handleTitleChange={handleTitleChange}
              handlePostUrlChange={handlePostUrlChange}
              handleAuthorChange={handleAuthorChange}
              handleUnsavedChanges={handleUnsavedChanges}
              handleFeatureImageChange={handleFeatureImageChange}
              handlePostTagId={handlePostTagId}
              handleSubmit={handleSubmit}
            />
          </Box>
        </Flex>
        <Flex
          m="1rem auto 0 auto"
          w="100%"
          maxW="1060px"
          flexDir={{ base: "column", lg: "row" }}
        >
          {!isEditingTitle ? (
            <>
              <Stack
                w="100%"
                maxW="1060px"
                direction="row"
                onClick={() => setIsEditingTitle(true)}
              >
                <Text
                  fontSize="2xl"
                  overflowWrap="break-word"
                  wordBreak="break-word"
                  data-testid="post-title"
                >
                  {title}
                </Text>
                <Text fontSize="2xl">
                  <FontAwesomeIcon icon={faEdit} />
                </Text>
              </Stack>
            </>
          ) : (
            <Formik
              initialValues={{ title: title }}
              onSubmit={(values, actions) => {
                const newTitle =
                  values.title.trim() == ""
                    ? "(UNTITLED)"
                    : values.title.trim();
                setTitle(newTitle);
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
                          w="100%"
                          isInvalid={form.errors.title && form.touched.title}
                        >
                          <Input
                            {...field}
                            placeholder="Title"
                            data-testid="post-title-field"
                            required
                          />
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
        <Box p="0 auto" m="0rem auto" w="100%" maxW="1060px">
          <Tiptap
            handleContentChange={handleContentChange}
            content={content}
            user={user}
            postId={postId}
          />
        </Box>
      </Flex>
    </>
  );
};
export default PostForm;

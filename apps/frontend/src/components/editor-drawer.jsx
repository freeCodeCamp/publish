import React, { useEffect, useState } from "react";
import { isEditor } from "@/lib/current-user";
import Link from "next/link";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import {
  Flex,
  Img,
  Box,
  Button,
  Text,
  Input,
  Spacer,
  IconButton,
  Wrap,
  Tag,
  FormControl,
  Divider,
  FormErrorMessage,
  TagLabel,
  TagCloseButton,
  CloseButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import slugify from "slugify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

const EditorDrawer = ({
  tags,
  authors,
  user,
  post,
  postUrl,
  postTagId,
  title,
  featureImage,
  handleUnsavedChanges,
  handlePostTagId,
  handleAuthorChange,
  handlePostUrlChange,
  handleFeatureImageChange,
  handleSubmit,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [searchedTags, setSearchedTags] = useState([]);
  const [isAddingTag, setIsAddingTag] = useState(false);

  const [postTagInputText, setPostTagInputText] = useState("");
  const [postTags, setPostTags] = useState([]);
  const [postTagSlug, setPostTagSlug] = useState([]);

  const [tagsList, setTagsList] = useState(tags);

  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    if (post) {
      const { tags } = post.attributes;

      const tagNames = tags.data.map((tag) => tag.attributes.name);
      const tagIds = tags.data.map((tag) => tag.id);
      const tagSlugs = tags.data.map((tag) => tag.attributes.slug);

      setPostTags(tagNames);
      handlePostTagId(tagIds);
      setPostTagSlug(tagSlugs);

      setAuthorName(post.attributes.author.data.attributes.name);
    }
  }, [post, handlePostTagId]);

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const apiBase = process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL;

    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch(new URL("api/upload", apiBase), {
      method: "post",
      body: formData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${user.jwt}`,
      },
    });

    if (response.status === 200) {
      const data = await response.json();

      handleFeatureImageChange(new URL(data[0].url, apiBase), data[0].id);
    }
  };

  function addTag(tagName, tagSlug) {
    if (!postTagSlug.includes(tagSlug)) {
      const newTags = [...postTags, tagName];
      const newTagSlugs = [...postTagSlug, tagSlug];

      const newTagsId = [];
      newTags.forEach((tag) => {
        tagsList.forEach((t) => {
          if (tag === t.attributes.name) {
            newTagsId.push(t.id);
          }
        });
      });

      setPostTags(newTags);
      handlePostTagId(newTagsId);
      setPostTagSlug(newTagSlugs);

      handleUnsavedChanges();
    }
  }

  async function handleTagSubmit(tagName) {
    const token = user.jwt;
    const data = {
      data: {
        name: tagName,
        slug: slugify(tagName, {
          lower: true,
          specialChar: false,
        }),
        posts: [],
        visibility: "public",
      },
    };

    try {
      const res = await createTag(token, data);
      setTagsList([...tags, res.data]);
      setSearchedTags([]);

      toast({
        title: "Tag Created.",
        description: "We've created your tag for you.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const handleTagSearch = (value) => {
    const searchedTags = tagsList.filter((tag) =>
      tag.attributes.name.toLowerCase().startsWith(value.toLowerCase()),
    );

    setSearchedTags(searchedTags);
  };

  return (
    <>
      <Box>
        <IconButton
          marginRight="auto"
          variant="ghost"
          onClick={onOpen}
          aria-label="Open Post Drawer"
          data-testid="open-post-drawer"
          icon={<FontAwesomeIcon icon={faGear} />}
        />
      </Box>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex width="100%" height="75px" justifyContent="space-between">
              <Box
                size="lg"
                py="1rem"
                textAlign="center"
                fontWeight="700"
                fontSize="20px"
                display="flex"
                alignItems="center"
              >
                <Img
                  src=" https://cdn.freecodecamp.org/platform/universal/fcc_puck_500.jpg"
                  width="32px"
                  height="32px"
                  mr="12px"
                  borderRadius="5px"
                />
                freeCodeCamp.org
              </Box>
              <CloseButton alignSelf="center" onClick={onClose} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Box
              display="flex"
              borderWidth="1px"
              borderRadius="lg"
              w="100%"
              h="175px"
              overflow="hidden"
              bg="#f1f5f9"
              justifyContent="center"
              alignItems="center"
            >
              {!featureImage ? (
                <>
                  <label htmlFor="feature-image" className="custom-file-upload">
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("feature-image").click()
                      }
                    >
                      Select Image
                    </button>
                  </label>
                  <input
                    type="file"
                    id="feature-image"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileInputChange}
                  />{" "}
                </>
              ) : (
                <Img
                  src={featureImage}
                  data-testid="feature-image"
                  borderRadius="lg"
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
              )}
            </Box>
            <Spacer h="1rem" />
            {featureImage && (
              <Button
                colorScheme="red"
                data-testid="delete-feature-image"
                w="100%"
                onClick={() => handleFeatureImageChange(null, null)}
              >
                Delete Image
              </Button>
            )}
            <Spacer h="1rem" />
            <Box id="tag-container" display="flex" flexWrap="wrap">
              <Wrap spacing={2}>
                {postTags.map((tag) => (
                  <Tag
                    key={tag}
                    size="lg"
                    borderRadius="full"
                    colorScheme="green"
                    variant="solid"
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton
                      onClick={() => {
                        const newTags = postTags.filter((t) => t !== tag);
                        setPostTags(newTags);

                        // remove id from postTagsId with the index of the tag
                        const newTagsId = postTagId.filter((_value, index) => {
                          return index !== postTags.indexOf(tag);
                        });

                        handlePostTagId(newTagsId);
                      }}
                    />
                  </Tag>
                ))}
              </Wrap>
            </Box>
            <Spacer h="1rem" />
            <Text fontSize="xl">Tags</Text>
            <AutoComplete
              openOnFocus
              restoreOnBlurIfEmpty={false}
              onSelectOption={(list) => {
                addTag(list.item.value, list.item.label);
                setPostTagInputText("");
              }}
            >
              <AutoCompleteInput
                variant="outline"
                placeholder="Filter by Tag"
                backgroundColor="white"
                value={postTagInputText}
                fontSize="14px"
                fontWeight="600"
                onChange={(event) => {
                  handleTagSearch(event.target.value);
                  setPostTagInputText(event.target.value);
                }}
              />
              <AutoCompleteList>
                {(searchedTags.length > 0 ? searchedTags : tagsList)
                  .slice(0, 25)
                  .map((tag) => (
                    <AutoCompleteItem
                      key={tag.id}
                      value={tag.attributes.name}
                      // this gives is the opportunity to add the tag to the post
                      // by setting the label to the slug
                      label={tag.attributes.slug}
                      textTransform="capitalize"
                      onClick={() => {
                        addTag(tag.attributes.name, tag.attributes.slug);
                        setPostTagInputText("");
                      }}
                    >
                      {tag.attributes.name}
                    </AutoCompleteItem>
                  ))}
              </AutoCompleteList>
            </AutoComplete>
            {isEditor(user) && (
              <>
                {!isAddingTag ? (
                  <Button
                    colorScheme="blue"
                    variant="link"
                    onClick={() => setIsAddingTag(true)}
                  >
                    Add new Tag
                  </Button>
                ) : (
                  <>
                    <Spacer h="1rem" />
                    <Formik
                      initialValues={{ tagName: "" }}
                      onSubmit={(values, actions) => {
                        setIsAddingTag(false);
                        handleTagSubmit(values.tagName);
                        actions.setSubmitting(false);
                        handleUnsavedChanges();
                      }}
                    >
                      {(props) => (
                        <Form>
                          <Field name="tagName">
                            {({ field, form }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.tagName && form.touched.tagName
                                }
                              >
                                <Input
                                  {...field}
                                  placeholder="tag name"
                                  w="100%"
                                  required
                                />
                                <FormErrorMessage>
                                  {form.errors.tagName}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Button
                            colorScheme="blue"
                            isLoading={props.isSubmitting}
                            type="submit"
                            w="100%"
                            margin={{ base: "1rem 0 0 0" }}
                          >
                            Submit
                          </Button>
                          <Button
                            colorScheme="red"
                            width="100%"
                            margin={{ base: "1rem 0 0 0" }}
                            onClick={() => setIsAddingTag(false)}
                          >
                            Cancel
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  </>
                )}
              </>
            )}
            <Spacer h="1rem" />
            {isEditor(user) && (
              <>
                <Spacer h="1rem" />
                <Text fontSize="xl">Author</Text>
                <AutoComplete
                  openOnFocus
                  onSelectOption={(list) => {
                    handleAuthorChange(list.item.value);
                    setAuthorName(list.item.label);
                  }}
                >
                  <AutoCompleteInput
                    variant="outline"
                    placeholder="Filter by Author"
                    backgroundColor="white"
                    fontSize="14px"
                    value={authorName}
                    fontWeight="600"
                    onChange={(event) => {
                      setAuthorName(event.target.value);
                      handleUnsavedChanges();
                    }}
                  />
                  <AutoCompleteList>
                    {authors.slice(0, 25).map((author) => (
                      <AutoCompleteItem
                        key={author.id}
                        value={author.id}
                        label={author.name}
                        textTransform="capitalize"
                        onClick={() => {
                          setAuthorName(author.name);
                        }}
                      >
                        {author.name}
                      </AutoCompleteItem>
                    ))}
                  </AutoCompleteList>
                </AutoComplete>
                <Spacer h="1rem" />
              </>
            )}
            <Spacer h="1rem" />
            <Text fontSize="xl">Post Url</Text>
            <label>
              <Input
                type="text"
                placeholder="Post Url"
                value={postUrl}
                id="slug"
                onChange={(event) => {
                  handlePostUrlChange(event.target.value);
                }}
                w="100%"
                marginTop="1rem"
                variant="outline"
              />
              <Text fontStyle="italic" fontSize="md">
                https://www.freecodecamp.com/news/
                {slugify(postUrl != "" ? postUrl : title, {
                  lower: true,
                  specialChar: false,
                })}
              </Text>
            </label>
            <Spacer h="1rem" />
            <Divider />
            <Spacer h="1rem" />
            <Button colorScheme="blue" w="100%" onClick={() => handleSubmit()}>
              Save as Draft
            </Button>
            <Spacer h="1rem" />
            <Link
              href={{
                pathname: `/posts/preview/${post.id}`,
              }}
              target="_blank"
            >
              <Button colorScheme="blue" w="100%" variant="outline">
                Preview
              </Button>
            </Link>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default EditorDrawer;

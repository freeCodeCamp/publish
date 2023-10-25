import { useCallback, useEffect, useState } from 'react';
import Tiptap from '@/components/tiptap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronLeft,
  faEdit,
  faGear
} from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import {
  Flex,
  Img,
  Box,
  Button,
  Text,
  Input,
  Spacer,
  Stack,
  Wrap,
  Tag,
  FormControl,
  Divider,
  FormErrorMessage,
  TagLabel,
  TagCloseButton,
  CloseButton,
  useDisclosure,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  InputGroup,
  InputRightElement,
  Icon
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { updatePost } from '@/lib/posts';
import { useToast } from '@chakra-ui/react';
import NextLink from 'next/link';
import Link from 'next/link';
import { isEditor } from '@/lib/current-user';
import { createTag } from '@/lib/tags';
import { useRouter } from 'next/router';

import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from '@choc-ui/chakra-autocomplete';

const PostForm = ({ tags, user, authors, post }) => {
  const toast = useToast();
  const router = useRouter();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const [title, setTitle] = useState('(UNTITLED)');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [postId, setPostId] = useState(post?.id);

  // tags from the post itself
  const [clientTags, setClientTags] = useState([]);
  const [clientTagsId, setClientTagsId] = useState([]);

  // tags from the server
  const [tagsList, setTagsList] = useState(tags);

  const [author, setAuthor] = useState('');
  const [authorName, setAuthorName] = useState('');

  const [postUrl, setPostUrl] = useState('');

  const [featureImage, setFeatureImage] = useState('');
  const [content, setContent] = useState(post?.attributes.body || '');

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    if (post) {
      const { title, body, tags, slug } = post.attributes;
      const { id } = post;

      setTitle(title);
      setContent(body);
      setPostId(id);

      const tagNames = tags.data.map(tag => tag.attributes.name);
      const tagIds = tags.data.map(tag => tag.id);

      setClientTags(tagNames);
      setClientTagsId(tagIds);
      setPostUrl(slug ?? '');
      setAuthorName(post.attributes.author.data.attributes.name);
    }
  }, [post]);

  const handleSubmit = useCallback(async () => {
    const nonce = uuidv4();
    const token = user.jwt;

    const data = {
      data: {
        title: title,
        slug: slugify(
          postUrl != '' ? postUrl : title != '(UNTITLED)' ? title : nonce,
          {
            lower: true,
            specialChar: false
          }
        ),
        body: content,
        tags: clientTagsId,
        author: [author != '' ? author : user.id],
        locale: 'en'
      }
    };

    try {
      await updatePost(postId, data, token);
      toast({
        title: 'Post Updated.',
        description: "We've updated your post for you.",
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      setUnsavedChanges(false);
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  }, [toast, postId, title, postUrl, content, clientTagsId, author, user]);

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSubmit();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSubmit]);

  // prompt the user if they try and leave with unsaved changes
  useEffect(() => {
    const warningText =
      'You have unsaved changes - are you sure you wish to leave this page?';

    // handle the user closing the window

    const handleWindowClose = event => {
      if (!unsavedChanges) return;
      event.preventDefault();
      return (event.returnValue = warningText);
    };

    // handle the user navigating to a new page via next/router

    const handleRouteChange = () => {
      if (!unsavedChanges) return;
      if (window.confirm(warningText)) return;
      router.events.emit('routeChangeError');
      throw 'routeChange aborted.';
    };

    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [unsavedChanges, router.events]);

  function handleFileInputChange(event) {
    const file = event.target.files[0];
    setFeatureImage(URL.createObjectURL(file));
  }

  function handleContentChange(content) {
    setContent(content);

    if (!unsavedChanges) {
      setUnsavedChanges(true);
    }
  }

  function addTag(tagName) {
    if (!clientTags.includes(tagName)) {
      const newTags = [...clientTags, tagName];

      const newTagsInt = [];
      newTags.forEach(tag => {
        tags.forEach(t => {
          if (tag === t.attributes.name) {
            newTagsInt.push(t.id);
          }
        });
      });

      setClientTags(newTags);
      setClientTagsId(newTagsInt);
      setUnsavedChanges(true);
    }
  }

  async function handleTagSubmit(tagName) {
    const token = user.jwt;
    const data = {
      data: {
        name: tagName,
        slug: slugify(tagName, {
          lower: true,
          specialChar: false
        }),
        posts: [],
        visibility: 'public'
      }
    };

    try {
      const res = await createTag(token, data);

      setTagsList([...tagsList, res.data]);

      toast({
        title: 'Tag Created.',
        description: "We've created your tag for you.",
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  }

  const handleTagSearch = value => {
    const searchedTags = tags.filter(tag =>
      tag.attributes.name.toLowerCase().startsWith(value.toLowerCase())
    );

    if (searchedTags.length > 0) {
      setTagsList(searchedTags);
    } else {
      setTagsList(tags);
    }
  };

  return (
    <>
      <Flex>
        <Flex flexDirection='column' mr='1rem' maxWidth='100%' flex='4'>
          <Flex justifyContent='space-between' m='1rem 0 0 5rem'>
            <Box>
              <Button
                variant='link'
                as={NextLink}
                href='/posts/'
                leftIcon={<FontAwesomeIcon size='lg' icon={faChevronLeft} />}
              >
                <Text fontSize='2xl'>Posts</Text>
              </Button>
            </Box>
            <Box>
              <IconButton
                marginRight='auto'
                variant='ghost'
                onClick={onOpen}
                aria-label='Open Post Drawer'
                icon={<FontAwesomeIcon icon={faGear} />}
              />
            </Box>
          </Flex>
          <Flex m='1rem 0 0 5rem' flexDir={{ base: 'column', lg: 'row' }}>
            {!isEditingTitle ? (
              <>
                <Stack direction='row' onClick={() => setIsEditingTitle(true)}>
                  <Text fontSize='2xl'>{title}</Text>
                  <Text fontSize='2xl'>
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
                {props => (
                  <Form style={{ width: '100%' }}>
                    <Stack direction={{ base: 'column', lg: 'row' }}>
                      <Field name='title'>
                        {({ field, form }) => (
                          <FormControl
                            w='30%'
                            isInvalid={form.errors.title && form.touched.title}
                          >
                            <Input {...field} placeholder='title' required />
                            <FormErrorMessage>
                              {form.errors.title}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Button
                        colorScheme='blue'
                        isLoading={props.isSubmitting}
                        type='submit'
                        w='15%'
                        margin={{ base: '0 0 1rem 0' }}
                      >
                        Done
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>
            )}
          </Flex>
          <Box p='0 0 0 5rem'>
            <Tiptap
              handleContentChange={handleContentChange}
              content={content}
              user={user}
              postId={postId}
            />
          </Box>
        </Flex>
      </Flex>
      <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex width='100%' height='75px' justifyContent='space-between'>
              <Box
                size='lg'
                py='1rem'
                textAlign='center'
                fontWeight='700'
                fontSize='20px'
                display='flex'
                alignItems='center'
              >
                <Img
                  src=' https://cdn.freecodecamp.org/platform/universal/fcc_puck_500.jpg'
                  width='32px'
                  height='32px'
                  mr='12px'
                  borderRadius='5px'
                />
                freeCodeCamp.org
              </Box>
              <CloseButton alignSelf='center' onClick={onClose} />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Box
              display='flex'
              borderWidth='1px'
              borderRadius='lg'
              w='100%'
              h='175px'
              overflow='hidden'
              bg='#f1f5f9'
              justifyContent='center'
              alignItems='center'
            >
              {!featureImage ? (
                <>
                  <label htmlFor='feature-image' className='custom-file-upload'>
                    <button
                      type='button'
                      onClick={() =>
                        document.getElementById('feature-image').click()
                      }
                    >
                      Select Image
                    </button>
                  </label>
                  <input
                    type='file'
                    id='feature-image'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />{' '}
                </>
              ) : (
                <Img
                  src={featureImage}
                  alt='feature'
                  borderRadius='lg'
                  objectFit='cover'
                  w='100%'
                  h='100%'
                />
              )}
            </Box>
            <Spacer h='1rem' />
            {featureImage && (
              <Button
                colorScheme='red'
                w='100%'
                onClick={() => setFeatureImage(null)}
              >
                Delete Image
              </Button>
            )}
            <Spacer h='1rem' />
            <Box id='tag-container' display='flex' flexWrap='wrap'>
              <Wrap spacing={2}>
                {clientTags.map(tag => (
                  <Tag
                    key={tag}
                    size='lg'
                    borderRadius='full'
                    colorScheme='green'
                    variant='solid'
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton
                      onClick={() => {
                        const newTags = clientTags.filter(t => t !== tag);
                        setClientTags(newTags);

                        // remove id from clientTagsId with the index of the tag
                        const newTagsId = clientTagsId.filter(
                          (_value, index) => {
                            return index !== clientTags.indexOf(tag);
                          }
                        );

                        setClientTagsId(newTagsId);
                      }}
                    />
                  </Tag>
                ))}
              </Wrap>
            </Box>
            <Spacer h='1rem' />
            <Text fontSize='xl'>Tags</Text>
            <AutoComplete
              openOnFocus
              restoreOnBlurIfEmpty={false}
              onSelectOption={() => {}}
            >
              <InputGroup>
                <AutoCompleteInput
                  variant='outline'
                  placeholder='Filter by Tag'
                  backgroundColor='white'
                  fontSize='14px'
                  fontWeight='600'
                  onChange={event => {
                    handleTagSearch(event.target.value);
                  }}
                />
                <InputRightElement>
                  <Icon icon={faChevronDown} fixedWidth />
                </InputRightElement>
              </InputGroup>
              <AutoCompleteList>
                {tagsList.slice(0, 25).map(tag => (
                  <AutoCompleteItem
                    key={tag.id}
                    value={tag.attributes.name}
                    textTransform='capitalize'
                    onClick={() => {
                      addTag(tag.attributes.name);
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
                    colorScheme='blue'
                    variant='link'
                    onClick={() => setIsAddingTag(true)}
                  >
                    Add new Tag
                  </Button>
                ) : (
                  <>
                    <Spacer h='1rem' />
                    <Formik
                      initialValues={{ tagName: '' }}
                      onSubmit={(values, actions) => {
                        setIsAddingTag(false);
                        handleTagSubmit(values.tagName);
                        actions.setSubmitting(false);
                        setUnsavedChanges(true);
                      }}
                    >
                      {props => (
                        <Form>
                          <Field name='tagName'>
                            {({ field, form }) => (
                              <FormControl
                                isInvalid={
                                  form.errors.tagName && form.touched.tagName
                                }
                              >
                                <Input
                                  {...field}
                                  placeholder='tag name'
                                  w='100%'
                                  required
                                />
                                <FormErrorMessage>
                                  {form.errors.tagName}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                          <Button
                            colorScheme='blue'
                            isLoading={props.isSubmitting}
                            type='submit'
                            w='100%'
                            margin={{ base: '1rem 0 0 0' }}
                          >
                            Submit
                          </Button>
                          <Button
                            colorScheme='red'
                            width='100%'
                            margin={{ base: '1rem 0 0 0' }}
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
            <Spacer h='1rem' />
            {isEditor(user) && (
              <>
                <Spacer h='1rem' />
                <Text fontSize='xl'>Author</Text>
                <AutoComplete openOnFocus>
                  <InputGroup>
                    <AutoCompleteInput
                      variant='outline'
                      placeholder='Filter by Author'
                      backgroundColor='white'
                      fontSize='14px'
                      value={authorName}
                      fontWeight='600'
                      onChange={event => {
                        setAuthorName(event.target.value);
                      }}
                    />
                    <InputRightElement>
                      <Icon icon={faChevronDown} fixedWidth />
                    </InputRightElement>
                  </InputGroup>
                  <AutoCompleteList>
                    {authors.slice(0, 25).map(author => (
                      <AutoCompleteItem
                        key={author.id}
                        value={author.slug}
                        textTransform='capitalize'
                        onClick={() => {
                          setAuthor(author.id);
                          setAuthorName(author.name);
                        }}
                      >
                        {author.name}
                      </AutoCompleteItem>
                    ))}
                  </AutoCompleteList>
                </AutoComplete>
                <Spacer h='1rem' />
              </>
            )}
            <Spacer h='1rem' />
            <Text fontSize='xl'>Publish Date</Text>
            <Spacer h='1rem' />
            <Box display='flex' flexDirection='row'>
              <Input type='date' variant='outline' />
              <Input type='time' variant='outline' />
            </Box>
            <Spacer h='1rem' />
            <Text fontSize='xl'>Post Url</Text>
            <label>
              <Input
                type='text'
                placeholder='Post Url'
                value={postUrl}
                id='slug'
                onChange={e => {
                  setPostUrl(e.target.value);
                  setUnsavedChanges(true);
                }}
                w='100%'
                marginTop='1rem'
                variant='outline'
              />
              <Text fontStyle='italic' fontSize='md'>
                https://www.freecodecamp.com/news/
                {slugify(postUrl != '' ? postUrl : title, {
                  lower: true,
                  specialChar: false
                })}
              </Text>
            </label>
            <Spacer h='1rem' />
            <Divider />
            <Spacer h='1rem' />
            <Button colorScheme='blue' w='100%' onClick={() => handleSubmit()}>
              Save as Draft
            </Button>
            <Spacer h='1rem' />
            <Link
              href={{
                pathname: `/posts/preview/${postId}`
              }}
              target='_blank'
            >
              <Button colorScheme='blue' w='100%' variant='outline'>
                Preview
              </Button>
            </Link>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default PostForm;

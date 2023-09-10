import { useEffect, useState } from 'react';
import Tiptap from '@/components/tiptap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import slugify from 'slugify';
import {
  Flex,
  Img,
  Box,
  Button,
  Text,
  Select,
  Input,
  Spacer,
  Stack,
  FormControl,
  FormErrorMessage
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { createPost, updatePost } from '@/lib/posts';

const PostForm = ({ tags, user, initialValues }) => {
  const [title, setTitle] = useState('this is the title');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [clientTags, setClientTags] = useState([]);
  const [clientTagsId, setClientTagsId] = useState([]);

  const [postUrl, setPostUrl] = useState('');

  const [featureImage, setFeatureImage] = useState('');
  const [content, setContent] = useState(initialValues?.attributes.body || '');

  const [id, setPostId] = useState(null);

  useEffect(() => {
    function removeTag(tag) {
      const newTags = clientTags.filter(t => t !== tag);
      setClientTags(newTags);
    }

    function createNewTags() {
      const tagContainer = document.getElementById('tag-container');

      if (tagContainer === null) return;

      tagContainer.innerHTML = '';

      clientTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.innerHTML = tag;
        const removeButton = document.createElement('button');
        removeButton.innerHTML = 'x';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => removeTag(tag));
        tagElement.appendChild(removeButton);
        tagContainer.appendChild(tagElement);
      });
    }
    createNewTags();
  }, [clientTags]);

  useEffect(() => {
    if (initialValues) {
      const { title, body, tags, slug } = initialValues.attributes;
      const { id } = initialValues;

      // console.log(initialValues);

      setTitle(title);
      setContent(body);
      setPostId(id);

      const tagNames = tags.data.map(tag => tag.attributes.name);
      const tagIds = tags.data.map(tag => tag.id);

      setClientTags(tagNames);
      setClientTagsId(tagIds);
      setPostUrl(slug ?? '');
    }
  }, [initialValues]);

  function handleFileInputChange(event) {
    const file = event.target.files[0];
    setFeatureImage(URL.createObjectURL(file));
  }

  function addTag(event) {
    if (!clientTags.includes(event.target.value)) {
      const newTags = [...clientTags, event.target.value];

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
    }
  }

  function handleContentChange(content) {
    setContent(content);
  }

  const handleSubmit = async () => {
    const token = user.jwt;
    const data = {
      data: {
        title: title,
        slug: slugify(postUrl != '' ? postUrl : title, {
          lower: true,
          specialChar: false
        }),
        body: content,
        tags: clientTagsId,
        author: [user.id],
        locale: 'en'
      }
    };

    try {
      if (!id) {
        const res = await createPost(JSON.stringify(data), token);
        setPostId(res.data.id);
        console.log('created');
      } else {
        await updatePost(id, JSON.stringify(data), token);
        console.log('updated');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex>
      <Flex
        flexDirection='column'
        w={{ base: 'full', md: '350px' }}
        flex='1'
        h='100vh'
        bgColor='white'
        borderRightWidth='1px'
        overflowY='hidden'
        padding={{ base: '0.5rem' }}
      >
        <Box overflowY='scroll'>
          <Box
            size='lg'
            py='1rem'
            mx='20px'
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
          <Text fontSize='xl'>Tags</Text>
          <Box id='tag-container' display='flex' flexWrap='wrap' />
          <Select
            placeholder='Select option'
            onChange={addTag}
            w='100%'
            marginTop='1rem'
          >
            {tags.map(tag => (
              <option key={tag.id} value={tag.attributes.name}>
                {tag.attributes.name}
              </option>
            ))}
          </Select>
          <Spacer h='1rem' />
          <Text fontSize='xl'>Publish Date</Text>
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
              onChange={e => setPostUrl(e.target.value)}
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
          <Button colorScheme='blue' w='100%' onClick={() => handleSubmit()}>
            Save as Draft
          </Button>
        </Box>
      </Flex>
      <Flex flexDirection='column' mr='0.5rem' flex='3'>
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
              }}
            >
              {props => (
                <Form>
                  <Stack direction={{ base: 'column', lg: 'row' }}>
                    <Field name='title'>
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.title && form.touched.title}
                        >
                          <Input
                            {...field}
                            placeholder='title'
                            w={{ base: '35%', lg: '100%' }}
                          />
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
                      w={{ base: '35%', lg: '100%' }}
                      margin={{ base: '0 0 1rem 0' }}
                    >
                      Submit
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          )}
          <Stack
            direction='row'
            spacing={4}
            marginLeft={{ base: '0', lg: 'auto' }}
          >
            <Button colorScheme='blue' variant='outline'>
              Preview
            </Button>
            <Button colorScheme='blue' variant='solid'>
              Send For Review
            </Button>
          </Stack>
        </Flex>
        <Box p='0 0 0 5rem'>
          <Tiptap
            handleContentChange={handleContentChange}
            defaultValue={content}
          />
        </Box>
      </Flex>
    </Flex>
  );
};
export default PostForm;

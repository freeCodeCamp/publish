import {
  Badge,
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  Grid,
  Heading,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  chakra,
  useToast,
  FormControl,
  InputRightElement,
  InputGroup
} from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList
} from '@choc-ui/chakra-autocomplete';
import { faChevronDown, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import intlFormatDistance from 'date-fns/intlFormatDistance';
import { getServerSession } from 'next-auth/next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

import { useState } from 'react';

import NavMenu from '@/components/nav-menu';
import { isEditor } from '@/lib/current-user';
import { createPost, getAllPosts, getUserPosts } from '@/lib/posts';
import { getTags } from '@/lib/tags';
import { getUsers } from '@/lib/users';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import Pagination from '@/components/pagination';

const Icon = chakra(FontAwesomeIcon);

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  // handle filtering posts on Strapi side (not NextJS side)

  const queryHandler = queries => {
    const filterQuery = {};

    for (const [key, value] of Object.entries(queries)) {
      if (key === 'publishedAt') {
        if (value === 'Preview') {
          filterQuery[key] = {
            $notNull: false
          };
        }

        if (value === 'Published') {
          filterQuery[key] = {
            $notNull: true
          };
        }
      }

      if (key === 'author') {
        filterQuery[key] = {
          slug: {
            $eq: value
          }
        };
      }

      if (key === 'tags') {
        filterQuery[key] = {
          slug: {
            $in: value
          }
        };
      }

      // remove all the all values after assigning it to filterQuery
      // semantically leaves the tags set to all in the URL but doesn't
      // filter by it and leaves it out.
      if (value === 'all' && Object.keys(filterQuery).includes(key)) {
        delete filterQuery[key];
      }
    }

    return filterQuery;
  };
  const [posts, usersData, tagsData] = await Promise.all([
    isEditor(session.user)
      ? getAllPosts(session.user.jwt, {
          publicationState: 'preview',
          fields: ['id', 'title', 'slug', 'publishedAt', 'updatedAt'],
          populate: ['author', 'tags'],
          pagination: {
            page: context.query.page || 1,
            pageSize: 6
          },
          filters: {
            ...queryHandler(context.query)
          }
        })
      : getUserPosts(session.user.jwt, {
          fields: ['id', 'title', 'slug', 'publishedAt', 'updatedAt'],
          populate: ['author', 'tags'],
          filters: {
            author: session.user.id,
            ...queryHandler(context.query)
          },
          pagination: {
            page: context.query.page || 1,
            pageSize: 6
          }
        }),
    getUsers(session.user.jwt, {
      fields: ['id', 'name', 'slug']
    }),
    getTags(session.user.jwt, {
      fields: ['id', 'name', 'slug'],
      pagination: {
        limit: -1
      }
    })
  ]);

  return {
    props: {
      posts,
      usersData,
      tagsData,
      user: session.user,
      queryParams: context.query,
      pagination: posts.meta
    }
  };
}

export default function IndexPage({
  posts,
  usersData,
  tagsData,
  user,
  queryParams,
  pagination
}) {
  const router = useRouter();
  const toast = useToast();

  const [searchedTags, setSearchedTags] = useState([]);
  const [hasSearchedTags, setHasSearchedTags] = useState(false);

  const [searchedAuthors, setSearchedAuthors] = useState([]);
  const [hasSearchedAuthors, setHasSearchedAuthors] = useState(false);

  const [hasUsedPostDropdown, setHasUsedPostDropdown] = useState(false);

  const [postInputText, setPostInputText] = useState(
    queryParams.publishedAt && queryParams.publishedAt != 'all'
      ? queryParams.publishedAt
      : ''
  );
  const [tagInputText, setTagInputText] = useState(
    queryParams.tags && queryParams.tags !== 'all' ? queryParams.tags : ''
  );
  const [authorInputText, setAuthorInputText] = useState(
    queryParams.author && queryParams.author !== 'all' ? queryParams.author : ''
  );

  // handle filtering posts on NextJS side (not Strapi side)

  const handleFilter = (filterType, value) => {
    const params = { ...queryParams };

    params[filterType] = value;

    if (filterType === 'tags' && value !== 'all') {
      setHasSearchedTags(true);
    }

    if (filterType === 'author' && value !== 'all') {
      setHasSearchedAuthors(true);
    }

    if (filterType === 'publishedAt' && value !== 'all') {
      setHasUsedPostDropdown(true);
    }

    router.replace({
      pathname: router.pathname,
      query: params
    });
  };

  // handle filtering tags and authors in searchbar

  const handleShallowFilter = async (filterType, value) => {
    if (filterType == 'tags') {
      const newtags = tagsData.data.filter(tag =>
        tag.attributes.name.toLowerCase().startsWith(value.toLowerCase())
      );

      setSearchedTags(newtags);
    }

    if (filterType == 'author') {
      const newUsers = usersData.filter(user =>
        user.name.toLowerCase().startsWith(value.toLowerCase())
      );

      setSearchedAuthors(newUsers);
    }
  };
  const newPost = async () => {
    const nonce = uuidv4();
    const token = user.jwt;

    const data = {
      data: {
        title: '(UNTITLED)',
        slug: nonce,
        body: '',
        tags: [],
        author: [user.id]
      }
    };

    try {
      const res = await createPost(data, token);

      router.push(`/posts/${res.data.id}`);
    } catch (err) {
      toast({
        title: 'An error occurred.',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <Box minH='100vh' bgColor='gray.200'>
      <NavMenu user={user} />

      <Box ml={{ base: 0, md: '300px' }} px='6'>
        <Flex
          alignItems='center'
          minH='20'
          position='sticky'
          top='0'
          bgColor='gray.200'
          zIndex={3}
        >
          <Heading>Posts</Heading>
          <Spacer />
          <Button colorScheme='blue' onClick={newPost}>
            New Post
          </Button>
        </Flex>

        <Grid
          my='4'
          gap='3'
          gridTemplateColumns={{
            base: '1fr',
            sm: '1fr 1fr',
            lg: '1fr 1fr 1fr 1fr'
          }}
        >
          {isEditor(user) && (
            <>
              <FormControl w='70'>
                <AutoComplete openOnFocus>
                  <>
                    <InputGroup>
                      <AutoCompleteInput
                        variant='outline'
                        placeholder='Filter by Post'
                        value={postInputText}
                        backgroundColor='white'
                      />
                      <InputRightElement>
                        <Icon
                          icon={hasUsedPostDropdown ? faClose : faChevronDown}
                          onClick={() => {
                            handleFilter('publishedAt', 'all');
                            setPostInputText('');
                            setHasUsedPostDropdown(false);
                          }}
                          fixedWidth
                        />
                      </InputRightElement>
                    </InputGroup>
                    <AutoCompleteList>
                      <AutoCompleteItem
                        value='Published'
                        textTransform='capitalize'
                        onClick={() => {
                          handleFilter('publishedAt', 'Published');
                          setPostInputText('Published');
                        }}
                      >
                        Published
                      </AutoCompleteItem>
                      <AutoCompleteItem
                        value='Draft'
                        textTransform='capitalize'
                        onClick={() => {
                          handleFilter('publishedAt', 'Preview');
                          setPostInputText('Draft');
                        }}
                      >
                        Draft
                      </AutoCompleteItem>
                    </AutoCompleteList>
                  </>
                </AutoComplete>
              </FormControl>

              <FormControl w='70'>
                <AutoComplete openOnFocus restoreOnBlurIfEmpty={false}>
                  <>
                    <InputGroup>
                      <AutoCompleteInput
                        variant='outline'
                        placeholder='Filter by Author'
                        value={authorInputText}
                        backgroundColor='white'
                        onChange={event => {
                          handleShallowFilter('author', event.target.value);
                          setAuthorInputText(event.target.value);
                        }}
                      />
                      <InputRightElement>
                        <Icon
                          icon={hasSearchedAuthors ? faClose : faChevronDown}
                          onClick={() => {
                            setHasSearchedAuthors(false);
                            handleFilter('author', 'all');
                            setAuthorInputText('');
                          }}
                          fixedWidth
                        />
                      </InputRightElement>
                    </InputGroup>
                    <AutoCompleteList>
                      {(searchedAuthors.length > 0
                        ? searchedAuthors
                        : usersData
                      )
                        .slice(0, 25)
                        .map(author => (
                          <AutoCompleteItem
                            key={`option-${author.id}`}
                            value={author.name}
                            textTransform='capitalize'
                            onClick={() => {
                              handleFilter('author', author.name);
                              setAuthorInputText(author.name);
                            }}
                          >
                            {author.name}
                          </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                  </>
                </AutoComplete>
              </FormControl>
            </>
          )}
          <FormControl w='70'>
            <AutoComplete openOnFocus restoreOnBlurIfEmpty={false}>
              <>
                <InputGroup>
                  <AutoCompleteInput
                    variant='outline'
                    placeholder='Filter by Tag'
                    value={tagInputText}
                    backgroundColor='white'
                    onChange={event => {
                      handleShallowFilter('tags', event.target.value);
                      setTagInputText(event.target.value);
                    }}
                  />
                  <InputRightElement>
                    <Icon
                      icon={hasSearchedTags ? faClose : faChevronDown}
                      fixedWidth
                      onClick={() => {
                        setHasSearchedTags(false);
                        handleFilter('tags', 'all');
                        setTagInputText('');
                      }}
                    />
                  </InputRightElement>
                </InputGroup>
                <AutoCompleteList>
                  {(searchedTags.length > 0 ? searchedTags : tagsData.data)
                    .slice(0, 25)
                    .map(tag => (
                      <AutoCompleteItem
                        key={`option-${tag.id}`}
                        value={tag.attributes.name}
                        textTransform='capitalize'
                        onClick={() => {
                          handleFilter('tags', tag.attributes.slug);
                          setTagInputText(tag.attributes.name);
                        }}
                      >
                        {tag.attributes.name}
                      </AutoCompleteItem>
                    ))}
                </AutoCompleteList>
              </>
            </AutoComplete>
          </FormControl>

          {/* <Menu>
            <FilterButton text={`Sort by:`} />
            <MenuList zIndex={2}>
              <MenuOptionGroup
                value={filter.sortBy}
                type='radio'
                onChange={value => setFilter({ ...filter, sortBy: value })}
              >
                <MenuItemOption value='newest'>Newest</MenuItemOption>
                <MenuItemOption value='oldest'>Oldest</MenuItemOption>
                <MenuItemOption value='recently-updated'>
                  Recently updated
                </MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu> */}
        </Grid>

        <Box pb='10'>
          <Table boxShadow='md' borderWidth='1px'>
            <Thead bgColor='rgb(243, 244, 246)'>
              <Tr>
                <Th>Title</Th>
                <Th w='140px' display={{ base: 'none', sm: 'table-cell' }}>
                  Status
                </Th>
              </Tr>
            </Thead>
            <Tbody bgColor='white'>
              {posts.data.map(post => {
                const title = post.attributes.title;
                const name = post.attributes.author.data.attributes.name;
                const tag = post.attributes.tags.data[0]?.attributes.name;
                const relativeUpdatedAt = intlFormatDistance(
                  new Date(post.attributes.updatedAt),
                  new Date()
                );
                const status = post.attributes.publishedAt ? (
                  <Badge>Published</Badge>
                ) : (
                  <Badge colorScheme='pink'>Draft</Badge>
                );
                return (
                  <Tr
                    display='table-row'
                    key={post.id}
                    _hover={{
                      bgColor: 'rgb(243, 244, 246)'
                    }}
                    position='relative'
                  >
                    <Td>
                      <ChakraLink
                        background='transparent'
                        as={NextLink}
                        display='block'
                        marginBottom='.25em'
                        _hover={{
                          background: 'transparent'
                        }}
                        _before={{
                          content: '""',
                          position: 'absolute',
                          inset: '0',
                          zIndex: '1',
                          width: '100%',
                          height: '100%',
                          cursor: 'pointer'
                        }}
                        href={`/posts/${post.id}`}
                        fontWeight='600'
                      >
                        {title}
                      </ChakraLink>
                      <Box
                        as='span'
                        fontSize='sm'
                        color='gray.500'
                        suppressHydrationWarning
                      >
                        By{' '}
                        <Box as='span' fontWeight='500' color='gray.500'>
                          {name}
                        </Box>{' '}
                        {tag && (
                          <>
                            in{' '}
                            <Box as='span' fontWeight='500' color='gray.500'>
                              {tag}
                            </Box>{' '}
                          </>
                        )}
                        • {relativeUpdatedAt}
                      </Box>
                      <Box display={{ base: 'block', sm: 'none' }} pt='4px'>
                        {status}
                      </Box>
                    </Td>
                    <Td display={{ base: 'none', sm: 'table-cell' }}>
                      {status}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            mt='4'
          >
            <Pagination
              pagination={pagination}
              endpoint={'posts'}
              queryParams={queryParams}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

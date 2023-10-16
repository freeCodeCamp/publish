import {
  Badge,
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  Grid,
  Heading,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  chakra,
  useToast
} from '@chakra-ui/react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import intlFormatDistance from 'date-fns/intlFormatDistance';
import { getServerSession } from 'next-auth/next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import NavMenu from '@/components/nav-menu';
import { isEditor } from '@/lib/current-user';
import { createPost, getAllPosts, getUserPosts } from '@/lib/posts';
import { getTags } from '@/lib/tags';
import { getUsers } from '@/lib/users';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const Icon = chakra(FontAwesomeIcon);

const sortButtonNames = {
  newest: 'Newest',
  oldest: 'Oldest',
  'recently-updated': 'Recently updated'
};

const filterByPostType = (post, filter) => {
  if (filter.postType === 'All') {
    return true;
  }
  if (filter.postType === 'Draft' && !post.attributes.publishedAt) {
    return true;
  }
  if (filter.postType === 'Published' && post.attributes.publishedAt) {
    return true;
  }
  return false;
};

const filterByAuthor = (post, filter) => {
  if (filter.author === 'all') {
    return true;
  }
  if (filter.author === post.attributes.author.data.attributes.slug) {
    return true;
  }
  return false;
};

const filterByTag = (post, filter) => {
  if (filter.tag === 'all') {
    return true;
  }
  if (
    post.attributes.tags.data[0] &&
    filter.tag === post.attributes.tags.data[0].attributes.slug
  ) {
    return true;
  }
  return false;
};

const FilterButton = ({ text, ...props }) => {
  return (
    <MenuButton
      as={Button}
      rightIcon={<Icon icon={faChevronDown} fixedWidth />}
      bgColor='white'
      borderRadius='md'
      fontSize='14px'
      boxShadow='sm'
      position='unset'
      _hover={{
        boxShadow: 'md'
      }}
      _active={{
        bgColor: 'white'
      }}
      {...props}
    >
      {text}
    </MenuButton>
  );
};

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const [posts, usersData, tagsData] = await Promise.all([
    isEditor(session.user)
      ? getAllPosts(session.user.jwt, {
          publicationState: 'preview',
          fields: ['id', 'title', 'slug', 'publishedAt', 'updatedAt'],
          populate: ['author', 'tags']
        })
      : getUserPosts(session.user.jwt, {
          publicationState: 'preview',
          fields: ['id', 'title', 'slug', 'publishedAt', 'updatedAt'],
          populate: ['author', 'tags'],
          filters: {
            author: session.user.id
          }
        }),
    getUsers(session.user.jwt, {
      fields: ['id', 'name', 'slug']
    }),
    getTags(session.user.jwt, {
      fields: ['id', 'name', 'slug']
    })
  ]);

  return {
    props: {
      posts,
      usersData,
      tagsData,
      user: session.user,
      queryParams: context.query
    }
  };
}

export default function IndexPage({
  posts,
  usersData,
  tagsData,
  user,
  queryParams
}) {
  const router = useRouter();
  const toast = useToast();

  const [filter, setFilter] = useState({
    postType: queryParams?.postType || 'All',
    author: queryParams?.author || 'all',
    tag: queryParams?.tag || 'all',
    sortBy: queryParams?.sortBy || 'newest'
  });
  let [filteredPosts, setFilteredPosts] = useState(posts.data);
  let [currentAuthor, setCurrentAuthor] = useState('all');
  let [currentTag, setCurrentTag] = useState('all');

  useEffect(() => {
    // Filter posts
    setFilteredPosts(
      posts.data
        .filter(post => {
          return (
            filterByPostType(post, filter) &&
            filterByAuthor(post, filter) &&
            filterByTag(post, filter)
          );
        })
        .sort((a, b) => {
          if (filter.sortBy === 'newest') {
            return (
              new Date(b.attributes.createdAt) -
              new Date(a.attributes.createdAt)
            );
          }
          if (filter.sortBy === 'oldest') {
            return (
              new Date(a.attributes.createdAt) -
              new Date(b.attributes.createdAt)
            );
          }
          if (filter.sortBy === 'recently-updated') {
            return (
              new Date(b.attributes.updatedAt) -
              new Date(a.attributes.updatedAt)
            );
          }
        })
    );
    setCurrentAuthor(usersData.find(user => user.slug === filter.author)?.name);
    setCurrentTag(
      tagsData.data.find(tag => tag.attributes.slug === filter.tag)?.attributes
        .name
    );

    // Update URL query params without reloading the page
    const queryParams = {};
    if (filter.postType !== 'All') {
      queryParams.postType = filter.postType;
    }
    if (filter.author !== 'all') {
      queryParams.author = filter.author;
    }
    if (filter.tag !== 'all') {
      queryParams.tag = filter.tag;
    }
    if (filter.sortBy !== 'newest') {
      queryParams.sortBy = filter.sortBy;
    }
    router.replace(
      {
        pathname: '/posts',
        query: queryParams
      },
      undefined,
      { shallow: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, posts.data, tagsData.data, usersData]);

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
              <Menu>
                <FilterButton text={filter.postType + ' posts'} />
                <MenuList zIndex={2}>
                  <MenuOptionGroup
                    value={filter.postType}
                    type='radio'
                    name='postType'
                    onChange={value =>
                      setFilter({ ...filter, postType: value })
                    }
                  >
                    <MenuItemOption value='All'>All posts</MenuItemOption>
                    <MenuItemOption value='Draft'>Drafts posts</MenuItemOption>
                    <MenuItemOption value='Published'>
                      Published posts
                    </MenuItemOption>
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
              <Menu>
                <FilterButton
                  text={filter.author === 'all' ? 'All authors' : currentAuthor}
                />
                <MenuList zIndex={2} maxH='50vh' overflowY='scroll'>
                  <MenuOptionGroup
                    value={filter.author}
                    type='radio'
                    onChange={value => setFilter({ ...filter, author: value })}
                  >
                    <MenuItemOption value='all'>All authors</MenuItemOption>
                    {usersData.map(user => (
                      <MenuItemOption key={user.id} value={user.slug}>
                        {user.name}
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </>
          )}
          <Menu>
            <FilterButton
              text={filter.tag === 'all' ? 'All tags' : currentTag}
            />
            <MenuList zIndex={2} maxH='50vh' overflowY='scroll'>
              <MenuOptionGroup
                value={filter.tag}
                type='radio'
                onChange={value => setFilter({ ...filter, tag: value })}
              >
                <MenuItemOption value='all'>All tags</MenuItemOption>
                {tagsData.data.map(tag => (
                  <MenuItemOption key={tag.id} value={tag.attributes.slug}>
                    {tag.attributes.name}
                  </MenuItemOption>
                ))}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <Menu>
            <FilterButton text={`Sort by: ${sortButtonNames[filter.sortBy]}`} />
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
          </Menu>
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
              {filteredPosts.map(post => {
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
        </Box>
      </Box>
    </Box>
  );
}

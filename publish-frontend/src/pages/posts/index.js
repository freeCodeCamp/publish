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
import { createPost, getPosts } from '@/lib/posts';
import { getTags } from '@/lib/tags';
import { getUsers } from '@/lib/users';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const Icon = chakra(FontAwesomeIcon);

const filterByPostType = (post, filter) => {
  if (filter.postType === 'all') {
    return true;
  }
  if (filter.postType === 'draft' && !post.attributes.publishedAt) {
    return true;
  }
  if (filter.postType === 'published' && post.attributes.publishedAt) {
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
  const [posts, users, tags] = await Promise.all([
    getPosts(session.user.jwt),
    getUsers(session.user.jwt),
    getTags(session.user.jwt)
  ]);
  return {
    props: {
      posts,
      users,
      tags,
      user: session.user
    }
  };
}

export default function IndexPage({ posts, users, tags, user }) {
  const router = useRouter();
  const toast = useToast();

  const [filter, setFilter] = useState({
    postType: 'all',
    author: 'all',
    tag: 'all',
    sortBy: 'newest'
  });
  let [filteredPosts, setFilteredPosts] = useState(posts.data);

  useEffect(() => {
    setFilteredPosts(
      posts.data.filter(post => {
        return (
          filterByPostType(post, filter) &&
          filterByAuthor(post, filter) &&
          filterByTag(post, filter)
        );
      })
    );
  }, [filter, posts.data]);

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
      const res = await createPost(JSON.stringify(data), token);

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
                    <MenuItemOption value='all'>All posts</MenuItemOption>
                    <MenuItemOption value='draft'>Drafts posts</MenuItemOption>
                    <MenuItemOption value='published'>
                      Published posts
                    </MenuItemOption>
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
              <Menu>
                <FilterButton
                  text={filter.author === 'all' ? 'All authors' : filter.author}
                />
                <MenuList zIndex={2}>
                  <MenuOptionGroup
                    value={filter.author}
                    type='radio'
                    onChange={value => setFilter({ ...filter, author: value })}
                  >
                    <MenuItemOption value='all'>All authors</MenuItemOption>
                    {users.map(user => (
                      <MenuItemOption key={user.id} value={user.slug}>
                        {user.name}
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
              <Menu>
                <FilterButton
                  text={filter.tag === 'all' ? 'All tags' : filter.tag}
                />
                <MenuList zIndex={2}>
                  <MenuOptionGroup
                    value={filter.tag}
                    type='radio'
                    onChange={value => setFilter({ ...filter, tag: value })}
                  >
                    <MenuItemOption value='all'>All tags</MenuItemOption>
                    {tags.data.map(tag => (
                      <MenuItemOption key={tag.id} value={tag.attributes.slug}>
                        {tag.attributes.name}
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </>
          )}
          <Menu>
            <FilterButton text='Sort by: Newest' gridColumnEnd='-1' />
            <MenuList zIndex={2}>
              <MenuOptionGroup value={filter.sortBy} type='radio'>
                <MenuItemOption value='newest'>Newsest</MenuItemOption>
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
                      <Box as='span' fontSize='sm' color='gray.500'>
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

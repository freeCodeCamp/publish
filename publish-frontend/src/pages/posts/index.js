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
import {useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import NavMenu from '@/components/nav-menu';
import { isEditor } from '@/lib/current-user';
import { createPost, getAllPosts, getUserPosts } from '@/lib/posts';
import { getTags } from '@/lib/tags';
import { getUsers } from '@/lib/users';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import Pagination from '@/components/pagination';

const Icon = chakra(FontAwesomeIcon);

const sortButtonNames = {
  newest: 'Newest',
  oldest: 'Oldest',
  'recently-updated': 'Recently updated'
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
  console.log(context.query)
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
      })
      : getUserPosts(session.user.jwt, {
        publicationState: 'preview',
        fields: ['id', 'title', 'slug', 'publishedAt', 'updatedAt'],
        populate: ['author', 'tags'],
        filters: {
          author: session.user.id
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
      fields: ['id', 'name', 'slug']
    })
  ]);

  console.log(posts)

  return {
    props: {
      posts,
      usersData,
      tagsData,
      user: session.user,
      queryParams: context.query,
      pagination: posts.meta,
    }
  };
}

export default function IndexPage({
  posts,
  usersData,
  tagsData,
  user,
  queryParams,
  pagination,
}) {
  const router = useRouter();
  const toast = useToast();

  const [filterText, setFilterText] = useState({
    postType: queryParams.postType || 'All',
    author: queryParams.author || 'All',
    tag: queryParams.tag || 'All',
  });

  const handleFilter = (filterType, value) => {
    const params = {...queryParams};


    if(filterType === 'author') {
      params.author = value;

    }

    if(filterType === 'postType') {
      params.postType = value;
    }

    if(filterType === 'tag') {
      params.tag = value;
    }

    router.replace({
      pathname: router.pathname,
      query: params,
    });
  }


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
                <FilterButton text={'Filter by Post'} />
                <MenuList zIndex={2}>
                  <MenuOptionGroup
                    value=''
                    type='radio'
                    name='postType'
                    onChange={value =>
                      handleFilter('postType', value)
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
                  text={'Filter by Author'}
                />
                <MenuList zIndex={2} maxH='50vh' overflowY='scroll'>
                  <MenuOptionGroup
                    value={''}
                    type='radio'
                    onChange={value => handleFilter('author', value)}
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
              text={'Filter by Tag'}
            />
            <MenuList zIndex={2} maxH='50vh' overflowY='scroll'>
              <MenuOptionGroup
                value={''}
                type='radio'
                onChange={value => handleFilter('tag', value)}
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
            <Pagination pagInfo={pagination} endpoint={'posts'} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

import {
  Badge,
  Box,
  Button,
  Flex,
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
  chakra
} from '@chakra-ui/react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import intlFormatDistance from 'date-fns/intlFormatDistance';
import { getServerSession } from 'next-auth/next';
import { signIn, useSession } from 'next-auth/react';
import NextLink from 'next/link';

import NavMenu from '@/components/nav-menu';
import { getPosts } from '@/lib/posts';
import { getTags } from '@/lib/tags';
import { getUsers } from '@/lib/users';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const Icon = chakra(FontAwesomeIcon);

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const [posts, users, tags] = await Promise.all([
    getPosts(),
    getUsers(session.user.jwt),
    getTags()
  ]);
  return {
    props: {
      posts,
      users,
      tags
    }
  };
}

export default function IndexPage({ posts, users, tags }) {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  if (isLoading) return 'Loading...';

  if (session) {
    return (
      <Box minH='100vh' bgColor='gray.200'>
        <NavMenu session={session} />

        <Box ml={{ base: 0, md: '300px' }} px='6'>
          <Flex alignItems='center' minH='20' position='sticky' top='0'>
            <Heading>Posts</Heading>
            <Spacer />
            <Button colorScheme='blue' as={NextLink} href='/posts/new'>
              New Post
            </Button>
          </Flex>

          <Flex boxShadow='sm' borderRadius='md' my='4'>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<Icon icon={faChevronDown} fixedWidth />}
                bgColor='white'
                borderTopRightRadius='0'
                borderBottomRightRadius='0'
                borderRightColor='gray.100'
                borderRightWidth='1px'
                fontSize='14px'
                flexGrow='1'
                _hover={{
                  boxShadow:
                    '0 0 0 1px rgba(0,0,0,.01), 0 2px 4px -1px rgba(0,0,0,.15)'
                }}
                _active={{
                  bgColor: 'white'
                }}
              >
                All posts
              </MenuButton>
              <MenuList>
                <MenuOptionGroup defaultValue='all' type='radio'>
                  <MenuItemOption value='all'>All posts</MenuItemOption>
                  <MenuItemOption value='drafts'>Drafts posts</MenuItemOption>
                  <MenuItemOption value='published'>
                    Published posts
                  </MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<Icon icon={faChevronDown} fixedWidth />}
                bgColor='white'
                borderRadius='0'
                borderRightColor='gray.100'
                borderRightWidth='1px'
                fontSize='14px'
                flexGrow='1'
                _hover={{
                  boxShadow:
                    '0 0 0 1px rgba(0,0,0,.01), 0 2px 4px -1px rgba(0,0,0,.15)'
                }}
                _active={{
                  bgColor: 'white'
                }}
              >
                All authors
              </MenuButton>
              <MenuList>
                <MenuOptionGroup defaultValue='all' type='radio'>
                  <MenuItemOption value='all'>All authors</MenuItemOption>
                  {users.map(user => (
                    <MenuItemOption key={user.id} value={user.id}>
                      {user.username}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<Icon icon={faChevronDown} fixedWidth />}
                bgColor='white'
                borderRadius='0'
                borderRightColor='gray.100'
                borderRightWidth='1px'
                fontSize='14px'
                flexGrow='1'
                _hover={{
                  boxShadow:
                    '0 0 0 1px rgba(0,0,0,.01), 0 2px 4px -1px rgba(0,0,0,.15)'
                }}
                _active={{
                  bgColor: 'white'
                }}
              >
                All tags
              </MenuButton>
              <MenuList>
                <MenuOptionGroup defaultValue='all' type='radio'>
                  <MenuItemOption value='all'>All tags</MenuItemOption>
                  {tags.data.map(tag => (
                    <MenuItemOption key={tag.id} value={tag.id}>
                      {tag.attributes.name}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<Icon icon={faChevronDown} fixedWidth />}
                bgColor='white'
                borderTopLeftRadius='0'
                borderBottomLeftRadius='0'
                fontSize='14px'
                flexGrow='1'
                _hover={{
                  boxShadow:
                    '0 0 0 1px rgba(0,0,0,.01), 0 2px 4px -1px rgba(0,0,0,.15)'
                }}
                _active={{
                  bgColor: 'white'
                }}
              >
                Sort by: Newest
              </MenuButton>
              <MenuList>
                <MenuOptionGroup defaultValue='newest' type='radio'>
                  <MenuItemOption value='newest'>Newsest</MenuItemOption>
                  <MenuItemOption value='oldest'>Oldest</MenuItemOption>
                  <MenuItemOption value='recently-updated'>
                    Recently updated
                  </MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </Flex>

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
                  const username =
                    post.attributes.author.data.attributes.username;
                  const relativeUpdatedAt = intlFormatDistance(
                    new Date(post.attributes.updatedAt),
                    new Date()
                  );
                  const status =
                    post.attributes.publishedAt !== null ? (
                      <Badge>Published</Badge>
                    ) : (
                      <Badge colorScheme='pink'>Draft</Badge>
                    );
                  return (
                    <Tr
                      as={NextLink}
                      href={`/posts/${post.id}`}
                      display='table-row'
                      key={post.id}
                      cursor='pointer'
                      _hover={{
                        bgColor: 'rgb(243, 244, 246)'
                      }}
                    >
                      <Td>
                        <Box fontWeight='600'>{title}</Box>
                        <Box as='span' fontSize='sm' color='gray.500'>
                          By{' '}
                          <Box as='span' fontWeight='500' color='gray.500'>
                            {username}
                          </Box>{' '}
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

  return (
    <>
      Not signed in <br />
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  );
}

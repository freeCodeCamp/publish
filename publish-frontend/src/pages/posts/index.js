import {
  Badge,
  Box,
  Button,
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
  chakra
} from '@chakra-ui/react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import intlFormatDistance from 'date-fns/intlFormatDistance';
import { getServerSession } from 'next-auth/next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import NavMenu from '@/components/nav-menu';
import { getPosts } from '@/lib/posts';
import { getTags } from '@/lib/tags';
import { getUsers } from '@/lib/users';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const Icon = chakra(FontAwesomeIcon);

const FilterButton = ({ text }) => {
  return (
    <MenuButton
      as={Button}
      rightIcon={<Icon icon={faChevronDown} fixedWidth />}
      bgColor='white'
      borderRadius='md'
      fontSize='14px'
      boxShadow='sm'
      _hover={{
        boxShadow: 'md'
      }}
      _active={{
        bgColor: 'white'
      }}
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
          zIndex='9999'
        >
          <Heading>Posts</Heading>
          <Spacer />
          <Button colorScheme='blue' as={NextLink} href='/posts/new'>
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
          <Menu>
            <FilterButton text='All posts' />
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
            <FilterButton text='All authors' />
            <MenuList>
              <MenuOptionGroup defaultValue='all' type='radio'>
                <MenuItemOption value='all'>All authors</MenuItemOption>
                {users.map(user => (
                  <MenuItemOption key={user.id} value={user.id}>
                    {user.name}
                  </MenuItemOption>
                ))}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <Menu>
            <FilterButton text='All tags' />
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
            <FilterButton text='Sort by: Newest' />
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
                    cursor='pointer'
                    _hover={{
                      bgColor: 'rgb(243, 244, 246)'
                    }}
                    onClick={() => router.push(`/posts/${post.id}`)}
                  >
                    <Td>
                      <Box fontWeight='600'>{title}</Box>
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

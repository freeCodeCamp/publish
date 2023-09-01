import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import intlFormatDistance from 'date-fns/intlFormatDistance';
import { signIn, useSession } from 'next-auth/react';
import NextLink from 'next/link'; // import as NextLink to avoid conflict with chakra-ui Link component

import NavMenu from '@/components/nav-menu';
import { getPosts } from '@/lib/posts';

export async function getServerSideProps() {
  const allPostsData = await getPosts();
  return {
    props: {
      allPostsData
    }
  };
}

export default function IndexPage({ allPostsData }) {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  if (isLoading) return 'Loading...';

  if (session) {
    return (
      <Box minH='100vh' bgColor='gray.100'>
        <NavMenu session={session} />

        <Box ml={{ base: 0, md: '300px' }} px='6'>
          <Flex
            alignItems='center'
            bgColor='rgb(237, 242, 246)'
            minH='20'
            position='sticky'
            top='0'
          >
            <Heading>Posts</Heading>
            <Spacer />
            <Button colorScheme='blue' as={NextLink} href='/posts/new'>
              New Post
            </Button>
          </Flex>

          <Box pb='10'>
            <Table boxShadow='md' borderWidth='1px'>
              <Thead bgColor='rgb(243, 244, 246)'>
                <Tr>
                  <Th>Title</Th>
                  <Th w='140px'>Status</Th>
                </Tr>
              </Thead>
              <Tbody bgColor='white'>
                {allPostsData.data.map(post => {
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
                      </Td>
                      <Td>{status}</Td>
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

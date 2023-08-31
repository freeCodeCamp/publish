import { Box, Button, Link, Flex, Heading, Spacer } from '@chakra-ui/react';
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

          <div>
            <ul>
              {allPostsData.data.map(post => {
                return (
                  <li key={post.id} style={{ marginBottom: '1.25rem' }}>
                    <Link as={NextLink} href={`/posts/${post.id}`}>
                      <strong>{post.attributes.title}</strong>
                      <br />
                      {post.attributes.body.slice(0, 150)}...
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
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

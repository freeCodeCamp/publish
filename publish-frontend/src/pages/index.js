import NextLink from 'next/link'; // import as NextLink to avoid conflict with chakra-ui Link component
import { useSession, signIn } from 'next-auth/react';
import { getPosts } from '../lib/posts';
import NavMenu from '@/components/nav-menu';

import { Box, Button } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';

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

        <Box ml={{ base: 0, md: '300px' }}>
          <div>
            <Button colorScheme='blue' as={NextLink} href='/posts/new'>
              New Post
            </Button>
          </div>

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

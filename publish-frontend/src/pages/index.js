import NextLink from 'next/link'; // import as NextLink to avoid conflict with chakra-ui Link component
import { useSession, signIn } from 'next-auth/react';
import { getPosts } from '../lib/posts';
import NavMenu from '@/components/nav-menu';

import { Button } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';

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
      <Flex>
        <NavMenu session={session} />

        <main className='p-3'>
          <div>
            <Button colorScheme='blue' as={NextLink} href='/posts/new'>
              New Post
            </Button>
          </div>

          <div>
            <ul>
              {allPostsData.data.map(post => {
                return (
                  <li key={post.id} className='mb-5'>
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
        </main>
      </Flex>
    );
  }

  return (
    <>
      Not signed in <br />
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  );
}

import NextLink from 'next/link'; // import as NextLink to avoid conflict with chakra-ui Link component
import { useSession, signIn } from 'next-auth/react';
import { getArticles } from '../lib/articles';
import NavMenu from '@/components/nav-menu';

import { Button } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';

export async function getServerSideProps() {
  const allArticlesData = await getArticles();
  return {
    props: {
      allArticlesData
    }
  };
}

export default function IndexPage({ allArticlesData }) {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  if (isLoading) return 'Loading...';

  if (session) {
    return (
      <Flex>
        <NavMenu session={session} />

        <main style={{ padding: '0.75rem' }}>
          <div>
            <Button colorScheme='blue' as={NextLink} href='/articles/new'>
              New Article
            </Button>
          </div>

          <div>
            <ul>
              {allArticlesData.data.map(article => {
                return (
                  <li key={article.id} style={{ marginBottom: '1.25rem' }}>
                    <Link as={NextLink} href={`/articles/${article.id}`}>
                      <strong>{article.attributes.title}</strong>
                      <br />
                      {article.attributes.body.slice(0, 150)}...
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

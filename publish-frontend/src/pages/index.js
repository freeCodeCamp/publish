import { useEffect } from 'react';
import Image from 'next/image';
import NextLink from 'next/link'; // import as NextLink to avoid conflict with chakra-ui Link component
import { useSession, signIn, signOut } from 'next-auth/react';
import { getMe } from '../lib/users';
import { getArticles } from '../lib/articles';
import NavMenu from '@/components/nav-menu';
// Chakra UI components
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

  return (
    <Flex>
     {/* <NavMenu session={session} /> */}

      <main className='p-3'>
        <div>
          <Button colorScheme='blue' as={NextLink} href='/articles/new'>
            New Article
          </Button>
        </div>

        <div>
          <ul>
            {allArticlesData.data.map(article => {
              return (
                <li key={article.id} className='mb-5'>
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


import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { getMe } from '../lib/users';
import { getArticles } from '../lib/articles';
import NavMenu from '@/components/nav-menu';

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
      <>
        <NavMenu session={session} />

        <main>
          <div>
            <Link href='/articles/new'>New Article</Link>
          </div>

          <div>
            <ul>
              {allArticlesData.data.map(article => {
                return (
                  <li key={article.id} className='mb-5'>
                    <Link href={`/articles/${article.id}`}>
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
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

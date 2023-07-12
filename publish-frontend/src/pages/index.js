import Image from 'next/image'
import Link from 'next/link'
import { getArticlesData } from '../lib/articles'
import { useSession, signIn, signOut } from "next-auth/react";

export async function getServerSideProps() {
  const allArticlesData = await getArticlesData();
  return {
    props: {
      allArticlesData,
    },
  };
}

export default function IndexPage({ allArticlesData }) {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  if (isLoading) return "Loading...";

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        {/* JWT token: {session.user.jwt}<br /> */}
        <button onClick={() => signOut()}>Sign out</button>

        <h1>Authoring Site (Next.js)</h1>

        <Link href="/articles/new">
          New Article
        </Link>

        <ul>
          {allArticlesData.data.map((article) => {
            return (
              <li key={article.id}>
                <Link href={`/articles/${article.id}`}>
                  <strong>{article.attributes.title}</strong><br/>
                  {article.attributes.body.slice(0, 150)}...
                </Link>
              </li>
            )
          })
          }
        </ul>
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

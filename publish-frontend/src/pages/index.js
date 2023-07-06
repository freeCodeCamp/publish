import Image from 'next/image'
import Link from 'next/link'
import { getPostsData } from '../lib/posts'
import { useSession, signIn, signOut } from "next-auth/react";

export async function getServerSideProps() {
  const allPostsData = await getPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function IndexPage({ allPostsData }) {
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

        <Link href="/posts/new">
          New Post
        </Link>

        <ul>
          {allPostsData.data.map((post) => {
            return (
              <li key={post.id}>
                <Link href={`/posts/${post.attributes.slug}`}>
                  <strong>{post.attributes.title}</strong><br/>
                  {post.attributes.body.slice(0, 150)}...
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

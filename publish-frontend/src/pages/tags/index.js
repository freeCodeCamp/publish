import { getServerSession } from 'next-auth/next';
import { useSession, signIn } from 'next-auth/react';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getTags } from '@/lib/tags';
import NavMenu from '@/components/nav-menu';
import TagsList from '@/components/tags-list';
import { Flex } from '@chakra-ui/react';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const allTagsData = await getTags(session.user.jwt);
  return {
    props: {
      allTagsData
    }
  };
}

export default function TagsIndex({ allTagsData }) {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  if (isLoading) return 'Loading...';

  if (session) {
    console.log('session.user:', session.user);

    return (
      <Flex>
        <NavMenu session={session} />
        <main style={{ padding: '0.75rem' }}>
          <TagsList allTagsData={allTagsData} />
        </main>
      </Flex>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

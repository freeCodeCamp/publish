import { useSession, signIn } from 'next-auth/react';
import { getUsers } from '@/lib/users';
import NavMenu from '@/components/nav-menu';
import UsersList from '@/components/users-list';
// Get session in getServerSideProps
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { Flex } from '@chakra-ui/react';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const allUsersData = await getUsers(session.user.jwt);
  return {
    props: {
      allUsersData
    }
  };
}

export default function UsersIndex({ allUsersData }) {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  if (isLoading) return 'Loading...';

  if (session) {
    console.log('session.user:', session.user);

    return (
      <Flex>
        <NavMenu session={session} />
        <main style={{ padding: '0.75rem' }}>
          <UsersList allUsersData={allUsersData} />
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

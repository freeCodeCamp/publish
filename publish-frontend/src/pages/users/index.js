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
      allUsersData,
      user: session.user
    }
  };
}

export default function UsersIndex({ allUsersData, user }) {
  return (
    <Flex>
      <NavMenu user={user} />
      <main style={{ padding: '0.75rem' }}>
        <UsersList allUsersData={allUsersData} />
      </main>
    </Flex>
  );
}

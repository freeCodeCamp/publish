import { Box, Button, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import { getServerSession } from 'next-auth/next';
import NextLink from 'next/link';

import NavMenu from '@/components/nav-menu';
import { getInvitedUsers } from '@/lib/invite-user';
import { getUsers } from '@/lib/users';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const allUsersData = await getUsers(session.user.jwt);
  const invitedUsers = await getInvitedUsers(session.user.jwt);

  return {
    props: {
      allUsersData,
      invitedUsers,
      user: session.user
    }
  };
}

export default function UsersIndex({ allUsersData, invitedUsers, user }) {
  return (
    <Box minH='100vh' bgColor='gray.200'>
      <NavMenu user={user} />

      <Box ml={{ base: 0, md: '300px' }} px='6'>
        <Flex
          alignItems='center'
          minH='20'
          position={{ md: 'sticky' }}
          top='0'
          bgColor='gray.200'
          zIndex='9999'
        >
          <Heading>Staff users</Heading>
          <Spacer />
          <Button colorScheme='blue' as={NextLink} href='/tags/new'>
            Invite user
          </Button>
        </Flex>

        <Box pb='10' mt='4'>
          <Heading size='md'>Invited Users</Heading>
          <Box py='4'>
            {invitedUsers.data.map(user => {
              if (user.attributes.accepted) return null;
              return (
                <Box key={user.id}>
                  <Text>{user.attributes.email}</Text>
                </Box>
              );
            })}
          </Box>

          <Heading size='md'>Active Users</Heading>
          <Box py='4'>
            {allUsersData.map(user => (
              <Box key={user.id}>
                <Text>{user.email}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Text
} from '@chakra-ui/react';
import intlFormatDistance from 'date-fns/intlFormatDistance';
import { getServerSession } from 'next-auth/next';
import NextLink from 'next/link';

import NavMenu from '@/components/nav-menu';
import { getInvitedUsers } from '@/lib/invite-user';
import { getUsers } from '@/lib/users';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const allUsers = await getUsers(session.user.jwt);
  const invitedUsers = await getInvitedUsers(session.user.jwt);

  return {
    props: {
      allUsers,
      invitedUsers,
      user: session.user
    }
  };
}

export default function UsersIndex({ allUsers, invitedUsers, user }) {
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
          <Box my='4' boxShadow='md' bgColor='white'>
            {invitedUsers.data.map(user => {
              if (user.attributes.accepted) return null;

              const userEmail = user.attributes.email;
              const createdAt = intlFormatDistance(
                new Date(user.attributes.createdAt),
                new Date()
              );
              return (
                <Flex
                  key={user.id}
                  py='2'
                  px='4'
                  alignItems='center'
                  justifyContent='space-between'
                  flexWrap={{ base: 'wrap', md: 'nowrap' }}
                  rowGap='2'
                  borderBottom='1px solid'
                  borderColor='gray.200'
                >
                  <Flex alignItems='center' pr='2'>
                    <Avatar size='sm' mr='4' />
                    <Flex flexDirection='column'>
                      <Text fontWeight='600'>{userEmail}</Text>
                      <Text fontSize='sm' color='gray.500'>
                        Invitation sent: {createdAt}
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex
                    alignItems='center'
                    fontSize='sm'
                    columnGap='4'
                    fontWeight='500'
                  >
                    <Text>Revoke</Text>
                    <Text>Resend</Text>
                    <Badge>Editor</Badge>
                  </Flex>
                </Flex>
              );
            })}
          </Box>

          <Heading size='md'>Active Users</Heading>
          <Box my='4' boxShadow='md' bgColor='white'>
            {allUsers.map(user => {
              const userEmail = user.email;
              console.log(user);
              const userRole = user.role.name;
              return (
                <Flex
                  key={user.id}
                  py='2'
                  px='4'
                  alignItems='center'
                  justifyContent='space-between'
                  flexWrap={{ base: 'wrap', md: 'nowrap' }}
                  rowGap='2'
                  borderBottom='1px solid'
                  borderColor='gray.200'
                  cursor='pointer'
                >
                  <Flex alignItems='center' pr='2'>
                    <Avatar size='sm' mr='4' />
                    <Text fontWeight='600'>{userEmail}</Text>
                  </Flex>
                  <Badge>{userRole}</Badge>
                </Flex>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

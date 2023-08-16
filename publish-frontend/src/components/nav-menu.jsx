import { isEditor } from '@/lib/current-user';
import { createToken } from '@/lib/email-token';
import {
  Badge,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  useToast
} from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import NextLink from 'next/link';
import { useState } from 'react';

export default function NavMenu({ session }) {
  const [inviteEmail, setInviteEmail] = useState('');
  const toast = useToast();

  const inviteUser = async () => {
    const status = await createToken(inviteEmail, session.user.jwt);
    toast({
      title: status ? 'User invited' : 'Error inviting user',
      status: status ? 'success' : 'error',
      duration: 5000,
      isClosable: true
    });
  };
  return (
    <nav className='border-r-2 border-gray-100 mr-3 p-3 h-screen'>
      <h1>Authoring Site (Next.js)</h1>
      <br />
      <ul>
        <li>
          <Link as={NextLink} href='/'>
            Posts
          </Link>
        </li>
        <li>
          <FormControl isRequired>
            <FormLabel>Invite User</FormLabel>
            <Input
              type='email'
              placeholder='foo@bar.com'
              onChange={e => setInviteEmail(e.target.value)}
            />
          </FormControl>
          <Button colorScheme='blue' onClick={inviteUser}>
            Invite
          </Button>
        </li>
        {isEditor(session) && (
          <>
            <li>
              <Link as={NextLink} href='/tags'>
                Tags
              </Link>
            </li>
            <li>
              <Link as={NextLink} href='/users'>
                Users
              </Link>
            </li>
          </>
        )}
      </ul>
      <br />
      <div>
        <Link as={NextLink} href='/profile'>
          Signed in as {session.user.email}{' '}
        </Link>
        <Badge colorScheme='blue'>{session.user?.role}</Badge>
        <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    </nav>
  );
}

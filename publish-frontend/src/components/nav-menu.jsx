import { signOut } from 'next-auth/react';
import { Badge } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Link } from '@chakra-ui/react';

export default function NavMenu({ session }) {
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
        {/* TODO: Show 'Tags' and 'Users' menu to Editors only */}
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

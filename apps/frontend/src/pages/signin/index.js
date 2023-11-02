import { Button } from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react';
import NextLink from 'next/link';

export default function IndexPage() {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  if (isLoading) return 'Loading...';

  // This is a temporary implementation
  if (session) {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <Button colorScheme='blue' as={NextLink} href='/'>
          View Posts
        </Button>
      </>
    );
  }
  return (
    <>
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  );
}

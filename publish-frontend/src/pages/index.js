import { Button } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';

export default function IndexPage() {
  return (
    <>
      Not signed in <br />
      <Button onClick={() => signIn(undefined, { callbackUrl: '/posts' })}>
        Sign in
      </Button>
    </>
  );
}

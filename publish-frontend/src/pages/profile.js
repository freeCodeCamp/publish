import { useSession, signIn } from 'next-auth/react';
import { getMe } from '../lib/users';
import NavMenu from '@/components/nav-menu';
// Get session in getServerSideProps
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { Flex } from '@chakra-ui/react';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userData = await getMe(session.user.jwt);
  return {
    props: {
      userData
    }
  };
}

export default function Profile({ userData }) {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  if (isLoading) return 'Loading...';

  console.log('userData:', JSON.stringify(userData));

  if (session) {
    return (
      <Flex>
        <NavMenu session={session} />

        <main className='p-3'>
          <ul>
            <li>
              <strong>Username:</strong> {userData.username}
            </li>
            <li>
              <strong>Email:</strong> {userData.email}
            </li>
            <li>
              <strong>name:</strong> {userData.name}
            </li>
            <li>
              <strong>bio:</strong> {userData.bio}
            </li>
            <li>
              <strong>website:</strong> {userData.website}
            </li>
            <li>
              <strong>location:</strong> {userData.location}
            </li>
            <li>
              <strong>facebook:</strong> {userData.facebook}
            </li>
            <li>
              <strong>twitter:</strong> {userData.twitter}
            </li>
            <li>
              <strong>role:</strong> {userData.role.name}
            </li>
            <li>
              <strong>profile_image:</strong>{' '}
              {userData.profile_image.formats.thumbnail.url}
            </li>
          </ul>
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

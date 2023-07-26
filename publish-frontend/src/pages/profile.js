import { useSession, signIn } from 'next-auth/react';
import { getMe } from '../lib/users';
import NavMenu from '@/components/nav-menu';
// Get session in getServerSideProps
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

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
      <>
        <NavMenu session={session} />

        <main>
          <ul>
            <li>Username: {userData.username}</li>
            <li>Email: {userData.email}</li>
            <li>displayName: {userData.displayName}</li>
            <li>bio: {userData.bio}</li>
            <li>website: {userData.website}</li>
            <li>location: {userData.location}</li>
            <li>facebook: {userData.facebook}</li>
            <li>twitter: {userData.twitter}</li>
            <li>role: {userData.role.name}</li>
            <li>profileImage: {userData.profileImage}</li>
          </ul>
        </main>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

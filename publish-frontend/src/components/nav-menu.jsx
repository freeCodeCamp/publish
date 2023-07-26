import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function NavMenu({ session }) {
  return (
    <nav>
      <Link href='/'>Authoring Site (Next.js)</Link>
      <ul>
        <li>
          <Link href='/'>Posts</Link>
        </li>
        <li>
          <Link href='/tags'>Tags</Link>
        </li>
        <li>
          <Link href='/users'>Users</Link>
        </li>
      </ul>
      <div>
        <Link href='/profile'>Signed in as {session.user.email} </Link>
        <span className='bg-gray-200 rounded p-1'>{session.user?.role}</span>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    </nav>
  );
}

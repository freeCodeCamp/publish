import React from 'react';
import PostForm from '@/components/post-form';
import { getTags } from '@/lib/tags';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getUsers } from '@/lib/users';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { data: tags } = await getTags(session.user.jwt);
  const authors = await getUsers(session.user.jwt);

  return {
    props: {
      tags: tags,
      user: session.user,
      author: session.user.id,
      authors
    }
  };
}

export default function NewPostPage({ tags, author, user, authors }) {
  return (
    <>
      <PostForm tags={tags} author={author} user={user} authors={authors} />
    </>
  );
}

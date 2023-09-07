import React from 'react';
import PostForm from '@/components/post-form';
import { getTags } from '@/lib/tags';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { data: tags } = await getTags(session.user.jwt);

  return {
    props: {
      tags: tags,
      author: session.user.id
    }
  };
}

export default function NewPostPage({ tags, author }) {
  return (
    <>
      <PostForm tags={tags} author={author} />
    </>
  );
}

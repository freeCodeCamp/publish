// import { useSession } from "next-auth/react";
import React from 'react';
import PostForm from '@/components/post-form';
import { getTags } from '@/lib/tags';
import { getUsers } from '@/lib/users';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const tags = await getTags();
  const authors = await getUsers(session.user.jwt);

  return {
    props: {
      authors: authors,
      tags: tags.data
    }
  };
}

export default function NewPostPage({ tags, authors }) {
  return (
    <>
      <PostForm tags={tags} author={authors[0]} />
    </>
  );
}

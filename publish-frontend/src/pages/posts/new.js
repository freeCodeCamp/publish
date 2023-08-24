// import { useSession } from "next-auth/react";
import React from 'react';
import PostForm from '@/components/post-form';
import { getUsers } from '@/lib/users';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getTags } from '@/lib/tags';
import { useSession } from 'next-auth/react';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const tags = await getTags();
  const authors = await getUsers(session.user.jwt);

  return {
    props: {
      tags: tags.data,
      authors: authors
    }
  };
}

export default function NewPostPage({ tags, authors }) {
  const { data: session } = useSession();

  // const handleContentChange = updatedContent => {
  //   setContent(updatedContent);
  // };

  return (
    <>
      {/* // We pass the event to the handleSubmit() function on submit. */}
      <PostForm tags={tags} authors={authors} session={session} />
    </>
  );
}

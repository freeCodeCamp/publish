import React from 'react';
import PostForm from '@/components/post-form';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Fetch tags from API
  const { data: tags } = await getTags(session.user.jwt);

  // Pass tags as props to the component
  return {
    props: {
      tags: tags
    }
  };
}

export default function NewPostPage({ tags }) {
  return (
    <>
      {/* // We pass the event to the handleSubmit() function on submit. */}
      <PostForm tags={tags} />
    </>
  );
}

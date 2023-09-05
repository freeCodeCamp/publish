// import { useSession } from "next-auth/react";
import React from 'react';
import PostForm from '@/components/post-form';
import { getTags } from '@/lib/tags';

export async function getServerSideProps() {
  const tags = await getTags();

  return {
    props: {
      tags: tags.data
    }
  };
}

export default function NewPostPage({ tags }) {
  return (
    <>
      <PostForm tags={tags} />
    </>
  );
}

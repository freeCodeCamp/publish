import PostForm from '@/components/post-form';
import { getPost } from '@/lib/posts';
import { getTags } from '@/lib/tags';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { postId } = context.params;
  const { data: tags } = await getTags();
  const { data: post } = await getPost(postId);
  return {
    props: { tags, post, author: session?.user?.id }
  };
}

export default function EditPostPage({ tags, post, author }) {
  return (
    <>
      <PostForm tags={tags} author={author} initialValues={post} />
    </>
  );
}

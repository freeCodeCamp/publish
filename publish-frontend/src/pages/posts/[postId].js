import PostForm from '@/components/post-form';
import { getPost } from '@/lib/posts';
import { getTags } from '@/lib/tags';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { postId } = context.params;
  const { data: tags } = await getTags(session.user.jwt);
  const { data: post } = await getPost(postId, session.user.jwt);
  return {
    props: { tags, post, user: session.user }
  };
}

export default function EditPostPage({ tags, post, user }) {
  return (
    <>
      <PostForm tags={tags} user={user} initialValues={post} />
    </>
  );
}

import PostForm from '@/components/post-form';
import { getPost } from '@/lib/posts';
import { getTags } from '@/lib/tags';
import { getUsers } from '@/lib/users';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { postId } = context.params;
  const { data: tags } = await getTags();
  const { data: post } = await getPost(postId);
  const authors = await getUsers(session.user.jwt);
  return {
    props: { tags, post, authors }
  };
}

export default function EditPostPage({ tags, post, authors }) {
  return (
    <>
      <PostForm tags={tags} authors={authors} initialValues={post} />
    </>
  );
}

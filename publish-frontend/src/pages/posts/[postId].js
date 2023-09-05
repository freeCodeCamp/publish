import PostForm from '@/components/post-form';
import { getPost } from '@/lib/posts';
import { getTags } from '@/lib/tags';

export async function getServerSideProps(context) {
  const { postId } = context.params;
  const { data: tags } = await getTags();
  const { data: post } = await getPost(postId);
  return {
    props: { tags, post }
  };
}

export default function EditPostPage({ tags, post }) {
  return (
    <>
      <PostForm tags={tags} initialValues={post} />
    </>
  );
}

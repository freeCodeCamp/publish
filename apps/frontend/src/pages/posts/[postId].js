import PostForm from "@/components/post-form";
import { getPost } from "@/lib/posts";
import { getTags } from "@/lib/tags";
import { getUsers } from "@/lib/users";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { postId } = context.params;
  const { data: tags } = await getTags(session.user.jwt, {
    fields: ["id", "name", "slug"],
    pagination: {
      limit: -1,
    },
  });

  const { data: post } = await getPost(postId, session.user.jwt);
  const authors = await getUsers(session.user.jwt, {
    fields: ["id", "name", "slug"],
  });

  return {
    props: { tags, post, authors, user: session.user },
  };
}

export default function EditPostPage({ tags, post, user, authors }) {
  return (
    <>
      <PostForm tags={tags} user={user} post={post} authors={authors} />
    </>
  );
}

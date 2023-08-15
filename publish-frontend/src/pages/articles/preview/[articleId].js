import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getPost } from '@/lib/posts';

export default function PreviewPostPage() {
  // Get auth data from the session
  const { data: session } = useSession();
  // declare state variables
  const [post, setPost] = useState(null);
  const [content, setContent] = useState('');

  // Get the postId from the dynamic segment in the URL
  const router = useRouter();
  const { postId } = router.query;

  useEffect(() => {
    // Fetch the post data from the server using the postId
    const fetchPost = async () => {
      try {
        const data = await getPost(postId);
        console.log('GET response: ', data);
        setPost(data.data);
        setContent(data.data.attributes.body);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  // loading screen
  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div>Preview</div>
      {/* TODO: Post preview page */}
      <div className='prose lg:prose-xl'>
        <h1>{post.attributes?.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.attributes?.body }}></div>
      </div>
    </>
  );
}

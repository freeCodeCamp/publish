import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import PostForm from '@/components/post-form';
import { useRouter } from 'next/router';
import { getPost, updatePost } from '@/lib/posts';

export default function EditPostPage() {
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

  const handleContentChange = updatedContent => {
    setContent(updatedContent);
  };

  // Handles the submit event on form submit.
  const handleSubmit = async (event, session) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Construct the data to be sent to the server
    const data = {
      // Need to nest in data object because Strapi expects so
      data: {
        title: event.target.title.value,
        body: content, // Get the content from the state
        slug: event.target.slug.value
      }
    };

    // Send the data to the Strapi server in JSON format.
    const JSONdata = JSON.stringify(data);

    // Bearer token for authentication
    const token = session.user.jwt;

    // Sending request
    try {
      const result = await updatePost(postId, JSONdata, token);
      console.log('updatePost response: ', JSON.stringify(result));
      alert('Saved!');
    } catch (error) {
      console.error('createPost Error:', error);
      alert('Failed to save the post');
    }
  };

  // loading screen
  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <PostForm
        onSubmit={event => handleSubmit(event, session)}
        initialValues={post}
        onContentChange={handleContentChange}
      />
    </>
  );
}



// import { useSession } from "next-auth/react";
import React from 'react';
import PostForm from '@/components/post-form';
// import { createPost } from '@/lib/posts';

const api_root = `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api`;

export async function getServerSideProps() {
  // Fetch tags from API
  const res = await fetch(`${api_root}/tags`);
  const tags = await res.json();

  console.log(tags);

  // Pass tags as props to the component
  return {
    props: {
      tags: tags.data
    }
  };
}

export default function NewPostPage({ tags }) {
  // Get auth data from the session
  //const { data: session } = useSession();
  // declare state variable `content`
  // const [content, setContent] = useState('');

  // const handleContentChange = updatedContent => {
  //   setContent(updatedContent);
  // };

  // Handles the submit event on form submit.
  // const handleSubmit = async (event, session) => {
  //   // Stop the form from submitting and refreshing the page.
  //   event.preventDefault();

  //   // Construct the data to be sent to the server
  //   const data = {
  //     // Need to nest in data object because Strapi expects so
  //     data: {
  //       title: event.target.title.value,
  //       body: content, // Get the content from the state
  //       slug: event.target.slug.value
  //     }
  //   };

  //   // Data to send to the Strapi server in JSON format.
  //   const JSONdata = JSON.stringify(data);

  //   // Bearer token for authentication
  //   const token = session.user.jwt;

  //   try {
  //     const result = await createPost(JSONdata, token);
  //     console.log('createPost response: ', JSON.stringify(result));
  //     alert('Saved!');
  //   } catch (error) {
  //     console.error('createPost Error:', error);
  //     alert('Failed to save the post');
  //   }
  // };

  return (
    <>
      {/* // We pass the event to the handleSubmit() function on submit. */}
      <PostForm tags={tags} />
    </>
  );
}

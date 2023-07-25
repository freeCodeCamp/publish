import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import ArticleForm from '@/components/article-form';
import { useRouter } from 'next/router';
import { getArticle, updateArticle } from 'src/lib/articles';

export default function EditArticlePage() {
  // Get auth data from the session
  const { data: session } = useSession();
  // declare state variables
  const [article, setArticle] = useState(null);
  const [content, setContent] = useState('');

  // Get the articleId from the dynamic segment in the URL
  const router = useRouter();
  const { articleId } = router.query;

  useEffect(() => {
    // Fetch the article data from the server using the articleId
    const fetchArticle = async () => {
      try {
        const data = await getArticle(articleId);
        console.log('GET response: ', data);
        setArticle(data.data);
        setContent(data.data.attributes.body);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [articleId]);

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
        body: content // Get the content from the state
      }
    };

    // Send the data to the Strapi server in JSON format.
    const JSONdata = JSON.stringify(data);

    // Bearer token for authentication
    const token = session.user.jwt;

    // Sending request
    try {
      const result = await updateArticle(articleId, JSONdata, token);
      console.log('updateArticle response: ', JSON.stringify(result));
      alert('Saved!');
    } catch (error) {
      console.error('createArticle Error:', error);
      alert('Failed to save the article');
    }

  };

  // loading screen
  if (!article) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* // We pass the event to the handleSubmit() function on submit. */}
      <ArticleForm
        onSubmit={event => handleSubmit(event, session)}
        initialValues={article}
        onContentChange={handleContentChange}
      />

      <Link href='/'>Home</Link>
    </>
  );
}



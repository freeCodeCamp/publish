import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Link from 'next/link'
import ArticleForm from "@/components/article-form";
import { useRouter } from 'next/router'

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
        console.log("articleId:", articleId)
        const response = await fetch(`http://localhost:1337/api/articles/${articleId}`);
        const data = await response.json();
        console.log("GET response: ", data)
        setArticle(data.data);
        setContent(data.data.attributes.body);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleContentChange = (updatedContent) => {
    setContent(updatedContent);
  };

  // Handles the submit event on form submit.
  const handleSubmit = async (event, session) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    // Construct the data to be sent to the server
    const data = {
      // Need to nest in data object because Strapi expects so
      data: {
        title: event.target.title.value,
        body: content, // Get the content from the state
      }
    };

    // Send the data to the Strapi server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = 'http://localhost:1337/api/articles'

    // Bearer token for authentication
    const token = session.user.jwt;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'PUT',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    // Send the form data to our forms API and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    const result = await response.json()
    alert(`response: ${JSON.stringify(result)}`)
  }

  // loading screen
  if (!article) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* // We pass the event to the handleSubmit() function on submit. */}
      <ArticleForm onSubmit={(event) => handleSubmit(event, session)} initialValues={article} onContentChange={handleContentChange} />

      <Link href="/">Home</Link>
    </>
  )
}



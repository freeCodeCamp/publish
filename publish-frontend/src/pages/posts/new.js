import {$getRoot, $getSelection} from 'lexical';
import { useSession } from "next-auth/react";
import React, { useRef } from "react";
import Link from 'next/link'
// import Editor from "../../components/editor";
import PlainTextEditor from "../../components/plain-text-editor";

export default function PageWithJSbasedForm() {
  const { data: session, status } = useSession();

  const editorRef = useRef();
  if (editorRef.current !== undefined) {
    if (editorRef.current !== null) {
      const latestEditorState = editorRef.current.getEditorState();
      // const textContent = latestEditorState.read(() =>
      //   //You could change getTextContent() for your purpose
      //   $getRoot().getTextContent()
      // );
      console.log(latestEditorState);
    }
  }

  // Handles the submit event on form submit.
  const handleSubmit = async (event, session) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    let bodyToPost = null;

    if (editorRef.current !== undefined) {
      if (editorRef.current !== null) {
        const latestEditorState = editorRef.current.getEditorState();
        // const textContent = latestEditorState.read(() =>
        //   //You could change getTextContent() for your purpose
        //   $getRoot().getTextContent()
        // );
        bodyToPost = JSON.stringify(latestEditorState);
        console.log(bodyToPost);
      }
    }

    // Get data from the form.
    const data = {
      data: {
        title: event.target.title.value,
        body: bodyToPost,
      },
    }

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = 'http://localhost:1337/api/articles'

    // Bearer token for authentication
    const token = session.user.jwt;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
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

  return (
    <>
      {/* // We pass the event to the handleSubmit() function on submit. */}
      <form onSubmit={(event) => handleSubmit(event, session)}>
        <label htmlFor="title">title</label>
        <input type="text" id="title" name="title" required />
        <br />
        <label htmlFor="body">body</label>
        {/* <input type="text" id="body" name="body" required /> */}
        {/* <Editor /> */}
        <PlainTextEditor ref={editorRef} />

        <button type="submit">Submit</button>
      </form>
      <Link href="/">Home</Link>
    </>
  )
}

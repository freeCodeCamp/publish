// Post API calls

const api_root = `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api`;

export async function getPosts() {
  const res = await fetch(`${api_root}/posts`);
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('getPosts Failed');
  }
  return res.json();
}

export async function getPost(postId) {
  console.log('postId:', postId);
  const res = await fetch(`${api_root}/posts/${postId}`);
  if (!res.ok) {
    throw new Error('getPost Failed');
  }
  return res.json();
}

export async function createPost(JSONdata, token) {
  // API endpoint where we send form data.
  const endpoint = `${api_root}/posts`;

  // Form the request for sending data to the server.
  const options = {
    method: 'POST',
    // Tell the server we're sending JSON.
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    // Body of the request is the JSON data we created above.
    body: JSONdata
  };

  // Send the form data to our forms API and get a response.
  const res = await fetch(endpoint, options);

  if (!res.ok) {
    throw new Error('createPost Failed');
  }

  return res.json();
}

export async function updatePost(postId, JSONdata, token) {
  // API endpoint where we send form data.
  const endpoint = `${api_root}/posts/${postId}`;

  // Form the request for sending data to the server.
  const options = {
    method: 'PUT',
    // Tell the server we're sending JSON.
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    // Body of the request is the JSON data we created above.
    body: JSONdata
  };

  // Send the form data to our forms API and get a response.
  const res = await fetch(endpoint, options);

  if (!res.ok) {
    throw new Error('updatePost Failed');
  }

  return res.json();
}

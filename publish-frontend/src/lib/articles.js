// Article API calls
const api_root = `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api`;

export async function getArticles() {
  const res = await fetch(`${api_root}/articles?publicationState=preview`);
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('getArticles Failed');
  }
  return res.json();
}

export async function getArticle(articleId) {
  console.log('articleId:', articleId);
  const res = await fetch(`${api_root}/articles/${articleId}`);
  if (!res.ok) {
    throw new Error('getArticle Failed');
  }
  return res.json();
}

export async function createArticle(JSONdata, token) {
  // API endpoint where we send form data.
  const endpoint = `${api_root}/articles`;

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
    throw new Error('createArticle Failed');
  }

  return res.json();
}

export async function updateArticle(articleId, JSONdata, token) {
  // API endpoint where we send form data.
  const endpoint = `${api_root}/articles/${articleId}`;

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
    throw new Error('updateArticle Failed');
  }

  return res.json();
}

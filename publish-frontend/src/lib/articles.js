export async function getArticlesData() {
  const res = await fetch('http://localhost:1337/api/articles');
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json();
}

export async function createArticle(JSONdata) {
  // const endpoint = 'http://localhost:1337/api/articles';

  // // Bearer token for authentication
  // const token = process.env.API_TOKEN;

  // // Form the request for sending data to the server.
  // const options = {
  //   // The method is POST because we are sending data.
  //   method: 'POST',
  //   // Tell the server we're sending JSON.
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`,
  //   },
  //   // Body of the request is the JSON data we created above.
  //   body: JSONdata,
  // };

  // // Send the form data to our forms API and get a response.
  // const res = await fetch(endpoint, options);

  // if (!res.ok) {
  //   // This will activate the closest `error.js` Error Boundary
  //   throw new Error('Failed to create article')
  // }

  // return res.json();
}

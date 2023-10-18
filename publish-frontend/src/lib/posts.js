// Post API calls

const api_root = `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api`;

export async function getPosts(page = 1, token) {
  const endpoint = `${api_root}/posts?publicationState=preview&populate=*&pagination[page]=${page}&pagination[pageSize]=6`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const res = await fetch(endpoint, options);

    if (!res.ok) {
      console.error('getAllPosts responded with error. Status: ', res.status);
      throw new Error(
        `getAllPosts responded with error. Status: ${res.status}`
      );
    }

    return res.json();
  } catch (error) {
    console.error('getAllPosts Failed. Error: ', error);
    throw new Error(`getAllPosts Failed. Error: ${error}`);
  }
}

export async function getUserPosts(page = 1, user) {
  const endpoint = `${api_root}/posts?publicationState=preview&filters[author]=${user.id}&populate=*&pagination[page]=${page}&pagination[pageSize]=10`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.jwt}`
    }
  };

  try {
    const res = await fetch(endpoint, options);

    if (!res.ok) {
      console.error('getUserPosts responded with error. Status: ', res.status);
      throw new Error(
        `getUserPosts responded with error. Status: ${res.status}`
      );
    }

    return res.json();
  } catch (error) {
    console.error('getUserPosts Failed. Error: ', error);
    throw new Error(`getUserPosts Failed. Error: ${error}`);
  }
}

export async function getPost(postId, token) {
  const endpoint = `${api_root}/posts/${postId}?populate=*`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const res = await fetch(endpoint, options);

    if (!res.ok) {
      console.error(
        `getPost responded with error. postId: ${postId}, Status: ${res.status}`
      );
      throw new Error(
        `getPost responded with error. postId: ${postId}, Status: ${res.status}`
      );
    }

    return res.json();
  } catch (error) {
    console.error(`getPost Failed. postId: ${postId}, Error: `, error);
    throw new Error(`getPost Failed. postId: ${postId}, Error: ${error}`);
  }
}

export async function createPost(data, token) {
  // API endpoint where we send form data.
  const endpoint = `${api_root}/posts`;

  // Form the request for sending data to the server.
  const options = {
    method: 'POST',
    // Tell the server we're sending JSON.
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  };
  // Send the form data to our forms API and get a response.
  const res = await fetch(endpoint, options);
  if (!res.ok) {
    throw new Error('createPost Failed');
  }

  return res.json();
}

export async function updatePost(postId, data, token) {
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
    body: JSON.stringify(data)
  };

  // Send the form data to our forms API and get a response.
  const res = await fetch(endpoint, options);

  if (!res.ok) {
    throw new Error('updatePost Failed');
  }

  return res.json();
}

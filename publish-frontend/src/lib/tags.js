// Tag API calls

const api_root = `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api`;

export async function getTags(token) {
  const endpoint = `${api_root}/tags?populate=*`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const res = await fetch(endpoint, options);

    return res.json();
  } catch (error) {
    console.error('getTags responded with error. Status: ', res?.body);
    throw new Error(`getTags responded with error. Status: ${res?.body}`);
  }
}

export async function createTag(token, data) {
  const endpoint = `${api_root}/tags`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  };

  try {
    const res = await fetch(endpoint, options);

    if (!res.ok) {
      console.error('createTag responded with error. Status: ', res?.status);
      throw new Error(`createTag responded with error. Status: ${res?.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('createTag Failed. Error: ', error);
    throw new Error(`createTag Failed. Error: ${error}`);
  }
}

export async function getTag(token, tagId) {
  const endpoint = `${api_root}/tags/${tagId}?populate=*`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const res = await fetch(endpoint, options);

    return res.json();
  } catch (error) {
    console.error('getTag responded with error. Status: ', res?.body);
    throw new Error(`getTag responded with error. Status: ${res?.body}`);
  }
}

export async function updateTag(token, tagId, data) {
  const endpoint = `${api_root}/tags/${tagId}?populate=*`;

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  };

  try {
    const res = await fetch(endpoint, options);

    return res.json();
  } catch (error) {
    console.error('updateTag responded with error. Status: ', res?.body);
    throw new Error(`updateTag responded with error. Status: ${res?.body}`);
  }
}

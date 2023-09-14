// Tag API calls

const api_root = `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api`;

export async function getTags(token) {
  const endpoint = `${api_root}/tags`;

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
      console.error('getTags responded with error. Status: ', res?.status);
      throw new Error(`getTags responded with error. Status: ${res?.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('getTags Failed. Error: ', error);
    throw new Error(`getTags Failed. Error: ${error}`);
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

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

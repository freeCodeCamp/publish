const api_root = `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api`;

export async function getRoles(token) {
  const endpoint = `${api_root}/users-permissions/roles`;

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
    console.error('getRoles responded with error. Status: ', res?.body);
    throw new Error(`getRoles responded with error. Status: ${res?.body}`);
  }
}

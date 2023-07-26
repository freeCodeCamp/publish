// Users & Permissions API calls

const api_root = `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api`;

export async function getMe(token) {
  const endpoint = `${api_root}/users/me?populate=role`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  const res = await fetch(endpoint, options);
  if (!res.ok) {
    throw new Error('getMe Failed');
  }
  return res.json();
}

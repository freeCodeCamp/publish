// Users & Permissions API calls

const api_root = `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api`;
export async function getMe(token) {
  const endpoint = `${api_root}/users/me?populate=*`;

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

export async function getUsers(token) {
  const endpoint = `${api_root}/users?populate=*`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  const res = await fetch(endpoint, options);

  if (!res.ok) {
    throw new Error('getUsers Failed');
  }
  return res.json();
}

export async function userExists(token, email) {
  const endpoint = `${api_root}/users?filters[email][$eqi]=${email}`;

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  const res = await fetch(endpoint, options);

  if (!res.ok) {
    throw new Error('userExists Failed');
  }

  const data = await res.json();
  return data.length > 0;
}

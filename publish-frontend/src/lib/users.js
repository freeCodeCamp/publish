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

export async function getUser(token, userId) {
  const endpoint = `${api_root}/users/${userId}?populate=role`;

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

export async function updateUser(token, userId, data) {
  const endpoint = `${api_root}/users/${userId}?populate=*`;

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  };

  const res = await fetch(endpoint, options);

  if (!res.ok) {
    throw new Error('updateUsers Failed');
  }
  return res.json();
}

export async function deleteUser(token, userId) {
  const endpoint = `${api_root}/users/${userId}?populate=*`;

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  const res = await fetch(endpoint, options);

  if (!res.ok) {
    throw new Error('deleteUsers Failed');
  }
  return res.json();
}

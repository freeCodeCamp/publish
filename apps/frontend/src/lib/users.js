import qs from 'qs';

// Users & Permissions API calls

const api_root = `${process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL}/api`;
export async function getMe(token, queryParams) {
  const endpoint = `${api_root}/users/me?${qs.stringify(queryParams, {
    encodeValuesOnly: true
  })}`;

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

export async function updateMe(token, data) {
  const endpoint = `${api_root}/users/me`;

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

export async function getUsers(token, queryParams) {
  const endpoint = `${api_root}/users?${qs.stringify(queryParams, {
    encodeValuesOnly: true
  })}`;

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
  const endpoint = `${api_root}/users?${qs.stringify(
    {
      filters: {
        email: {
          $eqi: email
        }
      }
    },
    {
      encodeValuesOnly: true
    }
  )}`;

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

export async function getUser(token, userId) {
  const endpoint = `${api_root}/users/${userId}?${qs.stringify(
    {
      populate: ['role']
    },
    {
      encodeValuesOnly: true
    }
  )}`;

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
  const endpoint = `${api_root}/users/${userId}`;

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
  const endpoint = `${api_root}/users/${userId}`;

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

import qs from "qs";

// Users & Permissions API calls
const base = process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL;
export async function getMe(token, queryParams) {
  const url = new URL("/api/users/me", base);
  url.search = qs.stringify(queryParams, {
    encodeValuesOnly: true,
  });

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error("getMe Failed");
  }
  return res.json();
}

export async function updateMe(token, data) {
  const url = new URL("/api/users/me", base);

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("updateUsers Failed");
  }
  return res.json();
}

export async function getUsers(token, queryParams) {
  const url = new URL("/api/users", base);
  url.search = qs.stringify(queryParams, {
    encodeValuesOnly: true,
  });

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("getUsers Failed");
  }
  return res.json();
}

export async function userExists(token, email) {
  const url = new URL("/api/users", base);
  url.search = qs.stringify(
    {
      filters: {
        email: {
          $eqi: email,
        },
      },
    },
    {
      encodeValuesOnly: true,
    },
  );

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("userExists Failed");
  }

  const data = await res.json();
  return data.length > 0;
}

export async function getUser(token, userId) {
  const url = new URL(`/api/users/${userId}`, base);
  url.search = qs.stringify(
    {
      populate: ["role"],
    },
    {
      encodeValuesOnly: true,
    },
  );

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("getUsers Failed");
  }
  return res.json();
}

export async function updateUser(token, userId, data) {
  const url = new URL(`/api/users/${userId}`, base);

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("updateUsers Failed");
  }
  return res.json();
}

export async function deleteUser(token, userId) {
  const url = new URL(`/api/users/${userId}`, base);

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error("deleteUsers Failed");
  }
  return res.json();
}

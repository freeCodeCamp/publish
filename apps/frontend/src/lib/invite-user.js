import qs from "qs";

const base = process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL;

export async function getInvitedUsers(token, queryParams) {
  const url = new URL("/api/invited-users", base);
  url.search = qs.stringify(queryParams, {
    encodeValuesOnly: true,
  });
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.message || `Something went wrong. Status: ${res.status}`,
      );
    }

    return data;
  } catch (error) {
    console.error(`getInvitedUsers Failed. Error: `, error);
    throw new Error(`getInvitedUsers Failed. Error: ${error}`);
  }
}

export async function inviteUser(token, data) {
  const url = new URL("/api/invited-users", base);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  try {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.message || `Something went wrong. Status: ${res.status}`,
      );
    }

    return true;
  } catch (error) {
    const { email } = data.data;
    console.error(`inviteUser Failed. email: ${email}, Error: `, error);
    throw new Error(`inviteUser Failed. email: ${email}, Error: ${error}`);
  }
}

export async function invitedUserExists(token, email) {
  const url = new URL("/api/invited-users", base);
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
    throw new Error("invitedUserExists Failed");
  }

  const data = await res.json();
  return data.data.length > 0;
}

export async function deleteInvitedUser(token, id) {
  const url = new URL(`/api/invited-users/${id}`, base);
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.message || `Something went wrong. Status: ${res?.status}`,
      );
    }

    return data;
  } catch (error) {
    console.error(`deleteInvitedUser Failed. Error: `, error);
    throw new Error(`deleteInvitedUser Failed. Error: ${error}`);
  }
}

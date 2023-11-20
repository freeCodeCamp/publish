const base = process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL;

export async function getRoles(token) {
  const url = new URL("/api/users-permissions/roles", base);

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await fetch(url, options);

    return res.json();
  } catch (error) {
    console.error("getRoles responded with error. Status: ", res?.body);
    throw new Error(`getRoles responded with error. Status: ${res?.body}`);
  }
}

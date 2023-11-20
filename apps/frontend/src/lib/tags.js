import qs from "qs";

// Tag API calls
const base = process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL;

export async function getTags(token, queryParams) {
  const url = new URL("/api/tags", base);
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

  try {
    const res = await fetch(url, options);

    return res.json();
  } catch (error) {
    console.error("getTags responded with error. Status: ", res.body);
    throw new Error(`getTags responded with error. Status: ${res.body}`);
  }
}

export async function createTag(token, data) {
  const url = new URL("/api/tags", base);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      console.error("createTag responded with error. Status: ", res.status);
      throw new Error(`createTag responded with error. Status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("createTag Failed. Error: ", error);
    throw new Error(`createTag Failed. Error: ${error}`);
  }
}

export async function getTag(token, tagId) {
  const url = new URL(`/api/tags/${tagId}`, base);
  url.search = qs.stringify(
    {
      populate: "*",
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

  try {
    const res = await fetch(url, options);

    return res.json();
  } catch (error) {
    console.error("getTag responded with error. Status: ", res.body);
    throw new Error(`getTag responded with error. Status: ${res.body}`);
  }
}

export async function updateTag(token, tagId, data) {
  const url = new URL(`/api/tags/${tagId}`, base);
  url.search = qs.stringify(
    {
      populate: "*",
    },
    {
      encodeValuesOnly: true,
    },
  );

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(url, options);

    return res.json();
  } catch (error) {
    console.error("updateTag responded with error. Status: ", res.body);
    throw new Error(`updateTag responded with error. Status: ${res.body}`);
  }
}

export async function deleteTag(token, tagId) {
  const url = new URL(`/api/tags/${tagId}`, base);

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await fetch(url, options);

    return res.json();
  } catch (error) {
    console.error("deleteTag responded with error. Status: ", res.body);
    throw new Error(`deleteTag responded with error. Status: ${res.body}`);
  }
}

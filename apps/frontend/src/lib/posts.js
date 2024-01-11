import qs from "qs";

// Post API calls

const base = process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL;

export async function getAllPosts(token, queryParams) {
  const url = new URL("/api/posts", base);
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

    if (!res.ok) {
      console.error("getAllPosts responded with error. Status: ", res.status);
      throw new Error(
        `getAllPosts responded with error. Status: ${res.status}`,
      );
    }

    return res.json();
  } catch (error) {
    console.error("getAllPosts Failed. Error: ", error);
    throw new Error(`getAllPosts Failed. Error: ${error}`);
  }
}

export async function getUserPosts(token, queryParams) {
  const url = new URL("/api/posts", base);
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

    if (!res.ok) {
      console.error("getUserPosts responded with error. Status: ", res.status);
      throw new Error(
        `getUserPosts responded with error. Status: ${res.status}`,
      );
    }

    return res.json();
  } catch (error) {
    console.error("getUserPosts Failed. Error: ", error);
    throw new Error(`getUserPosts Failed. Error: ${error}`);
  }
}

export async function getPost(postId, token) {
  const url = new URL(`/api/posts/${postId}`, base);
  url.search = "populate=*";

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      console.error(
        `getPost responded with error. postId: ${postId}, Status: ${res.status}`,
      );
      throw new Error(
        `getPost responded with error. postId: ${postId}, Status: ${res.status}`,
      );
    }

    return res.json();
  } catch (error) {
    console.error(`getPost Failed. postId: ${postId}, Error: `, error);
    throw new Error(`getPost Failed. postId: ${postId}, Error: ${error}`);
  }
}

export async function createPost(data, token) {
  const url = new URL("/api/posts", base);

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error("createPost Failed");
  }

  return res.json();
}

export async function updatePost(postId, data, token) {
  const url = new URL(`/api/posts/${postId}?populate=feature_image`, base);

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
    throw new Error("updatePost Failed");
  }

  return res.json();
}

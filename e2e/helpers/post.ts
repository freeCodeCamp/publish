import type { Page, APIRequestContext } from "@playwright/test";
const path = require("path");
const fs = require('fs');
const mime = require('mime-types'); //used to detect file's mime type
const fetch = require('node-fetch');
const FormData = require('form-data');

import { API_URL, EDITOR_CREDENTIALS } from "./constants";
import { getBearerToken } from "./user";

export async function deletePost(
  request: APIRequestContext,
  postId: string
) {
  const jwt = await getBearerToken(request, EDITOR_CREDENTIALS);
  await request.delete(`${API_URL}/api/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
}

export function getPostIdInURL(page: Page) {
  const pageUrl = page.url();
  const match = pageUrl.match(/.*\/posts\/(\d+)/);
  const postId = match ? match[1] : null; // Extract the new post id from the URL
  return postId;
}

export async function createPost(request: APIRequestContext) {
  // Create a new post via API
  const jwt = await getBearerToken(request, EDITOR_CREDENTIALS);
  const timestamp = Date.now();
  const createPostRes = await request.post(`${API_URL}/api/posts`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    data: {
      data: {
        title: `Test Post ${timestamp}`,
        slug: `test-post-${timestamp}`, // Make sure the slug is unique
        body: 'Test post body',
        author: [1]
      }
    },
  });
  return (await createPostRes.json()).data.id;
}

export async function createPostWithFeatureImage(request: APIRequestContext) {
  // Create a new post via API
  const postId = await createPost(request);

  // Attach a feature image to the post
  const jwt = await getBearerToken(request, EDITOR_CREDENTIALS);
  const formData = new FormData();
  const image = fs.createReadStream(path.join(__dirname, '..', 'fixtures', 'feature-image.png'));
  formData.append('files', image);
  formData.append('refId', postId);
  formData.append('ref', 'api::post.post');
  formData.append('field', 'feature_image');
  // Using fetch here since Playwright's request context didn't work
  const uploadRes = await fetch(new URL('api/upload', API_URL), {
    method: 'POST',
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });

  return postId;
}

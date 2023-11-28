import type { Page, APIRequestContext } from "@playwright/test";

import { API_URL } from "./constants";

export async function getBearerToken(
  request: APIRequestContext,
  credentials: { identifier: string; password: string }
) {
  const editorRes = await request.post(API_URL + "/api/auth/local", {
    data: credentials,
  });
  return (await editorRes.json()).jwt;
}

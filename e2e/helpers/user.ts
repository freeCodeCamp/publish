import type { Page, APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";

import { API_URL, EDITOR_CREDENTIALS } from "./constants";

export async function getBearerToken(
  request: APIRequestContext,
  data: { identifier: string; password: string }
) {
  const editorRes = await request.post(API_URL + "/api/auth/local", {
    data,
  });
  expect(editorRes.status()).toBe(200);
  return (await editorRes.json()).jwt;
}

async function getUsersHelper(
  request: APIRequestContext,
  data: { identifier: string; jwt: string }
) {
  const usersRes = await request.get(
    `${API_URL}/api/users?filters[email][$eq]=${data.identifier}`,
    {
      headers: {
        Authorization: `Bearer ${data.jwt}`,
      },
    }
  );
  return await usersRes.json();
}

export async function deleteUser(
  request: APIRequestContext,
  data: { identifier: string }
) {
  const jwt = await getBearerToken(request, EDITOR_CREDENTIALS);
  const user = await getUsersHelper(request, { ...data, jwt });
  if (user.length) {
    await request.delete(`${API_URL}/api/users/${user[0].id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
  }
}

export async function signIn(
  page: Page,
  credentials: { identifier: string; password: string }
) {
  await page.goto("/api/auth/signin?callbackUrl=%2Fposts");

  const emailField = page.getByLabel("Email");
  const passwordField = page.getByLabel("Password");
  const signinButton = page.getByRole("button", { name: "Sign in with email" });

  // Sign in via the UI
  await emailField.click();
  await emailField.fill(credentials.identifier);
  await emailField.press("Tab");
  await expect(passwordField).toBeFocused();
  await passwordField.fill(credentials.password);
  await passwordField.press("Tab");
  await expect(signinButton).toBeFocused();
  await signinButton.click();

  // Wait until the page receives the cookies.
  await page.waitForURL("**/posts");
}

export async function getUserByEmail(
  request: APIRequestContext,
  data: { identifier: string }
) {
  const jwt = await getBearerToken(request, EDITOR_CREDENTIALS);
  const users = await getUsersHelper(request, { ...data, jwt });
  // There should only be one user with this username, so we should assert that.
  expect(users).toHaveLength(1);
  return users[0];
}

// By default an invited user has the Auth0 provider. To allow the user to sign
// in in testing, we need to change the provider to local and set a password.
export async function useCredentialsForAuth(
  request: APIRequestContext,
  data: { identifier: string; password: string }
) {
  const { password } = data;
  const jwt = await getBearerToken(request, EDITOR_CREDENTIALS);
  const user = await getUserByEmail(request, data);
  const updateUserUrl = `${API_URL}/api/users/${user.id}`;
  const userRes = await request.put(updateUserUrl, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    data: { provider: "local", password },
  });
  expect(userRes.status()).toBe(200);
  return await userRes.json();
}

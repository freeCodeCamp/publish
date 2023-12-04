import type { Page, APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";

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
  data: { email: string; jwt: string }
) {
  const usersRes = await request.get(
    `${API_URL}/api/users?filters[email][$eq]=${data.email}`,
    {
      headers: {
        Authorization: `Bearer ${data.jwt}`,
      },
    }
  );
  const users = await usersRes.json();
  // There should only be one user with this username, so we should assert that.
  expect(users).toHaveLength(1);
  return users[0];
}
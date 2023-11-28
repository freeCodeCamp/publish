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

  await emailField.click();
  await emailField.fill(credentials.identifier);
  await emailField.press("Tab");
  await expect(passwordField).toBeFocused();
  await passwordField.fill(credentials.password);
  await passwordField.press("Tab");
  await expect(signinButton).toBeFocused();
  await signinButton.click();
}

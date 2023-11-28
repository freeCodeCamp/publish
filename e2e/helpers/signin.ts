import { expect, type Page } from "@playwright/test";

export async function signIn(page: Page, email: string, password: string) {
  await page.goto("/api/auth/signin?callbackUrl=%2Fposts");

  const emailField = page.getByLabel("Email");
  const passwordField = page.getByLabel("Password");
  const signinButton = page.getByRole("button", { name: "Sign in with email" });

  await emailField.click();
  await emailField.fill(email);
  await emailField.press("Tab");
  await expect(passwordField).toBeFocused();
  await passwordField.fill(password);
  await passwordField.press("Tab");
  await expect(signinButton).toBeFocused();
  await signinButton.click();
}

import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/");
  const emailField = page.getByLabel("Email");
  const passwordField = page.getByLabel("Password");
  const signinButton = page.getByRole("button", { name: "Sign in with email" });

  await page.getByRole("button", { name: "Sign in" }).click();
  await emailField.click();
  await emailField.fill("editor@user.com");
  await emailField.press("Tab");
  await expect(passwordField).toBeFocused();
  await passwordField.fill("editor");
  await passwordField.press("Tab");
  await expect(signinButton).toBeFocused();
  await signinButton.click();

  // Wait until the page receives the cookies.

  await page.waitForURL("**/posts");
  await page.context().storageState({ path: authFile });
});

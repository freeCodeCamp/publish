import { test, expect } from "@playwright/test";

test("has a button to create a new post", async ({ page }) => {
  await page.goto("/posts");

  await page.getByRole("button", { name: "New post" }).click();
  
  await expect(page).toHaveURL(/.*\/posts\/\d+/);
  await expect(page.getByRole("link", { name: "Posts" })).toBeVisible();
});

import { test, expect } from "@playwright/test";

test("has a button to create a new post", async ({ page }) => {
  await page.goto("/posts");

  await page.getByRole("button", { name: "New post" }).click();
  
  await expect(page).toHaveURL(/.*\/posts\/\d+/);
  await expect(page.getByRole("link", { name: "Posts" })).toBeVisible();
});

test("a contributor can view drafted posts in the list of posts", async ({ page }) => {
  await page.goto("/posts?publicationState='preview'");
  
  page.getByText('Draft');
});

test("a contributor can view published posts in the list of posts", async ({ page }) => {
  await page.goto("/posts");
  
  page.getByText('Published');
});
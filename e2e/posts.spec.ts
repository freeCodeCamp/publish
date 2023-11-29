import { test, expect } from "@playwright/test";

test("has a button to create a new post", async ({ page }) => {
  await page.goto("/posts");

  await page.getByRole("button", { name: "New post" }).click();
  
  await expect(page).toHaveURL(/.*\/posts\/\d+/);
  await expect(page.getByRole("link", { name: "Posts" })).toBeVisible();
});

test("an editor can view published and drafted posts in the list of posts", async ({ page }) => {
  await page.goto("/posts");

  page.getByText('PUBLISHED');

  page.getByText('DRAFT');
});

test('an editor can filter by drafted posts', async ({ page }) => {
  await page.goto("/posts");

  await page.getByRole("button", { name: "All posts" }).click();

  await page.waitForSelector('text=Drafts posts');
  await page.click('text=Drafts posts');
});

test('an editor can filter by published posts', async ({ page }) => {
  await page.goto("/posts");

  await page.getByRole("button", { name: "All posts" }).click();

  await page.waitForSelector('text=Published posts');
  await page.click('text=Published posts');
});

test('an editor can filter by all posts', async ({ page }) => {
  await page.goto("/posts");

  await page.getByRole("button", { name: "All posts" }).click();

  await page.waitForSelector('text=All posts');
  await page.click('text=All posts');
});
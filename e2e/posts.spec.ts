import { test, expect } from "@playwright/test";

test("has a button to create a new post", async ({ page }) => {
  await page.goto("/posts");

  await page.getByRole("button", { name: "New post" }).click();

  await expect(page).toHaveURL(/.*\/posts\/\d+/);
  await expect(page.getByRole("link", { name: "Posts" })).toBeVisible();
});

test("an editor can view published and drafted posts in the list of posts", async ({
  page,
}) => {
  await page.goto("/posts");

  // The filter on posts page should be "All posts" by default
  await expect(page.getByRole("button", { name: "All posts" })).toBeVisible();

  // Show 50 posts to see both draft and published posts
  await page.getByTestId("results-per-page").dispatchEvent("click");
  await page.click("text=50");
  // Wait for the table to load
  await page.waitForSelector("table tbody tr:nth-child(6)");

  // Check that both draft and published posts are in the list
  const publishedCount = await page
    .locator("data-testid=published-badge")
    .count();
  expect(publishedCount).toBeGreaterThanOrEqual(1);
  const draftCount = await page.locator("data-testid=draft-badge").count();
  expect(draftCount).toBeGreaterThanOrEqual(1);
});

test("an editor can filter by draft posts", async ({ page }) => {
  await page.goto("/posts");

  // Show 50 posts to see both draft and published posts
  await page.getByTestId("results-per-page").dispatchEvent("click");
  await page.click("text=50");

  // Select the "Drafts posts" filter
  await page.getByRole("button", { name: "All posts" }).dispatchEvent("click");
  await page.click("text=Drafts posts");

  // Wait for published posts to disappear
  await expect(page.locator("data-testid=published-badge")).toHaveCount(0);
  // Check that draft posts are in the list
  const draftCount = await page.locator("data-testid=draft-badge").count();
  expect(draftCount).toBeGreaterThanOrEqual(1);
});

test("an editor can filter by published posts", async ({ page }) => {
  await page.goto("/posts");

  // Show 50 posts to see both draft and published posts
  await page.getByTestId("results-per-page").dispatchEvent("click");
  await page.click("text=50");

  // Select the "Published posts" filter
  await page.getByRole("button", { name: "All posts" }).dispatchEvent("click");
  await page.click("text=Published posts");

  // Wait for draft posts to disappear
  await expect(page.locator("data-testid=draft-badge")).toHaveCount(0);
  // Check that published posts are in the list
  const publishedCount = await page
    .locator("data-testid=published-badge")
    .count();
  expect(publishedCount).toBeGreaterThanOrEqual(1);
});

import { test, expect } from "@playwright/test";

test.describe("contributor", () => {
  test("can only view draft posts", async ({ page }) => {
    await page.goto("/posts");

    // the filter "All posts" should be hidden
    await expect(page.getByRole("button", { name: "All posts" })).toBeHidden();

    // check that only draft posts are in the list
    const publishedCount = await page
      .locator("data-testid=published-badge")
      .count();
    expect(publishedCount).toBe(0);
    const draftCount = await page.locator("data-testid=draft-badge").count();
    expect(draftCount).toBeGreaterThanOrEqual(1);
  });

  test("can only view their own posts", async ({ page }) => {
    await page.goto("/posts");

    // check that other user's posts are not in the list
    const ownPostsCount = await page.getByText("By contributor-user").count();
    const otherPostsCount = await page.getByText("By editor-user").count();
    expect(ownPostsCount).toBeGreaterThanOrEqual(1);
    expect(otherPostsCount).toBe(0);
  });
});

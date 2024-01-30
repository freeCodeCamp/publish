import { test, expect } from "@playwright/test";

import { deletePost, createPostWithFeatureImage } from "./helpers/post";

test.describe('feature image', () => {
  const postIdsToDelete: string[] = [];

  test.afterAll(async ({ request }) => {
    // delete all posts created in the tests
    for (const postId of postIdsToDelete) {
      await deletePost(request, postId);
    }
  })

  test('feature image should be visible in preview', async ({ page, request }) => {
    // Prepare existing post that has a feature image
    const postId = await createPostWithFeatureImage(page, request);
    postIdsToDelete.push(postId);

    // Open a post
    await page.goto(`/posts/${postId}`);

    // Open the drawer
    const drawerButton = page.getByTestId('open-post-drawer');
    await drawerButton.click();

    // Open the preview
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('button', { name: 'Preview' }).click(),
    ]);

    // Check that saved feature image is visible
    await expect(newPage.getByTestId('feature-image-preview')).toBeVisible();
  });

  test('preview should open without feature image', async ({ page }) => {
    // Open a post
    await page.goto('/posts/1');

    // Open the drawer
    const drawerButton = page.getByTestId('open-post-drawer');
    await drawerButton.click();

    // Open the preview
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('button', { name: 'Preview' }).click(),
    ]);

    // Check that the preview was opened successfully
    await expect(newPage.locator('text="No image provided"')).toBeVisible();
  });
})

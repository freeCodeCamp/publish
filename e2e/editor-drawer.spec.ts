import { test, expect } from "@playwright/test";
import path from 'path';

import { deletePost, getPostIdInURL, createPostWithFeatureImage } from "./helpers/post";

test.describe('feature image', () => {
  let postIdsToDelete: string[] = [];

  test.afterAll(async ({ request }) => {
    // delete all posts created in the tests
    for (const postId of postIdsToDelete) {
      await deletePost(request, postId);
    }
  })

  test('it should be possible to save without a feature image', async ({ page, request }) => {
    // Open a new post
    await page.goto('/posts');
    await page.getByRole('button', { name: 'New post' }).click();
    await page.waitForURL(/.*\/posts\/\d+/);
    // Store the post id to delete after the test
    const postId = getPostIdInURL(page);
    if (postId) {
      // Store the post id to delete after the test
      postIdsToDelete.push(postId);
    }

  // Save the new post without adding a feature image
    await page.keyboard.down('Control');
    await page.keyboard.press('s');

    // Check that the post was saved successfully
    const saveNotificationTitle = page.locator('#toast-1-title');
    const saveNotificationDescription = page.locator('#toast-1-description');
    await saveNotificationTitle.waitFor(); // Wait for the toast to appear
    expect(saveNotificationTitle).toBeVisible();
    expect(await saveNotificationTitle.innerText()).toBe('Post has been updated.');

    expect(saveNotificationDescription).toBeVisible();
    expect(await saveNotificationDescription.innerText()).toBe('The post has been updated.');
  })

  test('it should be possible to save with a feature image', async ({ page, request }) => {
    // Open a new post
    await page.goto('/posts');
    await page.getByRole('button', { name: 'New post' }).click();
    await page.waitForURL(/.*\/posts\/\d+/);
    // Store the post id to delete after the test
    const postId = getPostIdInURL(page); // Extract the new post id from the URL
    if (postId) {
      // Store the post id to delete after the test
      postIdsToDelete.push(postId);
    }

    // Prepare promises before clicking the button
    const fileChooserPromise = page.waitForEvent('filechooser');
    const waitForUploadPromise = page.waitForResponse('**/api/upload');

    // Select a feature image
    const drawerButton = page.getByTestId('open-post-drawer');
    await drawerButton.click();

    const fileChooserButton = page.locator('text="Select Image"');
    await fileChooserButton.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, '/fixtures/feature-image.png'));

    // Make sure the feature image was uploaded before saving the post
    // Check that the feature image upload returns 200
    expect((await waitForUploadPromise).status()).toBe(200);

    // Prepare a promise before pressing the save shortcut
    const waitForSavePromise = page.waitForResponse(`**/api/posts/${postId}?populate=feature_image`);

    // Save the new post with a feature image
    await page.keyboard.down('Control');
    await page.keyboard.press('s');

    // Check that the post was saved successfully
    const saveNotificationTitle = page.locator('#toast-1-title');
    await saveNotificationTitle.waitFor(); // Wait for the toast to appear
    expect(saveNotificationTitle).toBeVisible();
    expect(await saveNotificationTitle.innerText()).toBe('Post has been updated.');

    // Check that the update post request returns 200
    expect((await waitForSavePromise).status()).toBe(200);
  })

  // TODO: Fix failure due to timeout
  test.skip('the saved image should be visible in the drawer and can be deleted', async ({ page, request }) => {
    // Prepare existing post that has a feature image
    const postId = await createPostWithFeatureImage(page, request);
    if (postId) {
      // Store the post id to delete after the test
      postIdsToDelete.push(postId);
    }

    // Open the post
    await page.goto(`/posts/${postId}`);
    await page.getByTestId('open-post-drawer').click();

    // Check that saved feature image is visible in the drawer
    expect(page.getByTestId('feature-image')).toBeVisible();

    // Check that it's possible to delete the feature image
    const deleteImageButton = page.getByTestId('delete-feature-image');
    await deleteImageButton.click();

    // Prepare a promise before pressing the save shortcut
    const nextPromise = page.waitForResponse(`**/api/posts/${postId}?populate=feature_image`);
    await page.keyboard.down('Control');
    await page.keyboard.press('s');

    // Wait for the save notification to appear
    const saveNotificationTitle = page.locator('#toast-1-title');
    await saveNotificationTitle.waitFor(); // Wait for the toast to appear
    expect(saveNotificationTitle).toBeVisible();
    expect(await saveNotificationTitle.innerText()).toBe('Post has been updated.');

    // Check that the update post request returns 200
    expect((await nextPromise).status()).toBe(200);

    // Check that deleted image has dissapeared from the drawer
    await page.goto(`/posts/${postId}`);
    await page.getByTestId('open-post-drawer').click();
    expect(page.getByTestId('feature-image')).not.toBeVisible();
  });
})


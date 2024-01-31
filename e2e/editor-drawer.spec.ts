import { test, expect } from "@playwright/test";
import path from "path";

import {
  deletePost,
  getPostIdInURL,
  createPostWithFeatureImage,
} from "./helpers/post";

test.describe("feature image", () => {
  const postIdsToDelete: string[] = [];

  test.afterAll(async ({ request }) => {
    // delete all posts created in the tests
    for (const postId of postIdsToDelete) {
      await deletePost(request, postId);
    }
  });

  test("it should be possible to save without a feature image", async ({
    page,
  }) => {
    // Open a new post
    await page.goto("/posts");
    await page.getByRole("button", { name: "New post" }).click();
    await page.waitForURL(/.*\/posts\/\d+/);
    // Store the post id to delete after the test
    const postId = getPostIdInURL(page);
    if (postId) {
      // Store the post id to delete after the test
      postIdsToDelete.push(postId);
    }

    // Wait for the editor to load
    await page.getByTestId("editor").waitFor();

    // Save the new post without adding a feature image
    await page.keyboard.down("Control");
    await page.keyboard.press("s");

    // Check that the post was saved successfully
    const saveNotificationTitle = page.locator("#toast-1-title");
    const saveNotificationDescription = page.locator("#toast-1-description");
    await expect(saveNotificationTitle).toBeVisible();
    expect(await saveNotificationTitle.innerText()).toBe(
      "Post has been updated.",
    );

    await expect(saveNotificationDescription).toBeVisible();
    expect(await saveNotificationDescription.innerText()).toBe(
      "The post has been updated.",
    );
  });

  test("it should be possible to save with a feature image", async ({
    page,
  }) => {
    // Open a new post
    await page.goto("/posts");
    await page.getByRole("button", { name: "New post" }).click();
    await page.waitForURL(/.*\/posts\/\d+/);
    // Store the post id to delete after the test
    const postId = getPostIdInURL(page); // Extract the new post id from the URL
    if (postId) {
      // Store the post id to delete after the test
      postIdsToDelete.push(postId);
    }

    // Prepare promises before clicking the button
    const fileChooserPromise = page.waitForEvent("filechooser");
    const waitForUploadPromise = page.waitForResponse("**/api/upload");

    // Open the drawer
    const drawerButton = page.getByTestId("open-post-drawer");
    await drawerButton.click();

    // Select a feature image
    const fileChooserButton = page.locator('text="Select Image"');
    await fileChooserButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(
      path.join(__dirname, "/fixtures/feature-image.png"),
    );

    // Wait for feature image upload to complete before saving the post
    await waitForUploadPromise;

    // Prepare a promise before pressing the save shortcut
    const waitForSavePromise = page.waitForResponse(
      `**/api/posts/${postId}?populate=feature_image`,
    );

    // Save the new post with a feature image
    await page.keyboard.down("Control");
    await page.keyboard.press("s");

    // Wait for the request to complete
    await waitForSavePromise;

    // Check that the post was saved successfully
    const saveNotificationTitle = page.locator("#toast-1-title");
    await expect(saveNotificationTitle).toBeVisible();
    expect(await saveNotificationTitle.innerText()).toBe(
      "Post has been updated.",
    );
  });

  test("the saved image should be visible in the drawer and can be deleted", async ({
    page,
    request,
  }) => {
    // Prepare existing post that has a feature image
    const postId = await createPostWithFeatureImage(page, request);
    if (postId) {
      // Store the post id to delete after the test
      postIdsToDelete.push(postId);
    }

    // Open the post
    await page.goto(`/posts/${postId}`);

    // Check that saved feature image is visible in the drawer
    await page.getByTestId("open-post-drawer").click();
    await expect(page.getByTestId("feature-image")).toBeVisible();

    // Check that it's possible to delete the feature image
    const deleteImageButton = page.getByTestId("delete-feature-image");
    await deleteImageButton.click();

    // Prepare a promise before pressing the save shortcut
    const nextPromise = page.waitForResponse(
      `**/api/posts/${postId}?populate=feature_image`,
    );
    await page.keyboard.down("Control");
    await page.keyboard.press("s");

    // Wait for the request to complete
    await nextPromise;

    // Wait for the save notification to appear
    const saveNotificationTitle = page.locator("#toast-1-title");
    await expect(saveNotificationTitle).toBeVisible();
    expect(await saveNotificationTitle.innerText()).toBe(
      "Post has been updated.",
    );

    // Reopen the post
    await page.goto(`/posts/${postId}`);
    await page.getByTestId("open-post-drawer").click();
    // Wait for the drawer to open
    await page.locator('text="Select Image"').waitFor();

    // Check that deleted image has dissapeared
    await expect(page.getByTestId("feature-image")).not.toBeVisible();
  });
});

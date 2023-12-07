import { test, expect } from "@playwright/test";
import path from 'path';

test('it should be possible to save without an image present', async ({ page }) => {
    await page.goto('/posts/1');

    await page.keyboard.down('Control');
    await page.keyboard.press('s');

    const saveNotificationTitle = page.locator('#toast-1-title');
    const saveNotificationDescription = page.locator('#toast-1-description');

    expect(saveNotificationTitle).toBeVisible();
    expect(await saveNotificationTitle.innerText()).toBe('Post has been updated.');

    expect(saveNotificationDescription).toBeVisible();
    expect(await saveNotificationDescription.innerText()).toBe('The post has been updated.');
})

test('it should be possible to save', async ({ page }) => {
    await page.goto('/posts/2');

    const fileChooserPromise = page.waitForEvent('filechooser');

    // wait for the feature image upload to return 200 from the server before saving
    const waitForUploadPromise = page.waitForResponse('**/api/upload');

    const drawerButton = page.getByTestId('open-post-drawer');
    await drawerButton.click();

    const fileChooserButton = page.locator('text="Select Image"');
    await fileChooserButton.click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, '/fixtures/feature-image.png'));

    await waitForUploadPromise;

    const waitForSavePromise = page.waitForResponse('**/api/posts/2?populate=feature_image');

    await page.keyboard.down('Control');
    await page.keyboard.press('s');

    const saveNotificationTitle = page.locator('#toast-1-title');
    const saveNotificationDescription = page.locator('#toast-1-description');

    expect(saveNotificationDescription).toBeInViewport();
    expect(await saveNotificationTitle.innerText()).toBe('Post has been updated.');

    expect(saveNotificationDescription).toBeInViewport();
    expect(await saveNotificationDescription.innerText()).toBe('The post has been updated.');
    
    await waitForSavePromise;
})


test('the saved image should be visible in the drawer', async ({ page }) => {
    await page.goto('/posts/2');

    await page.getByTestId('open-post-drawer').click();

    const image = page.getByTestId('feature-image');
    expect(image).toBeVisible();

    const deleteImageButton = page.getByTestId('delete-feature-image');
    await deleteImageButton.click();

    const nextPromise = page.waitForResponse('**/api/posts/2?populate=feature_image');

    await page.keyboard.down('Control');
    await page.keyboard.press('s');

    await nextPromise;

    await page.goto('/posts/2');
    await page.getByTestId('open-post-drawer').click();

    expect(image).not.toBeVisible();
})
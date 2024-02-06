import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/posts/2");
});

test("it should be possible to type in the editor", async ({ page }) => {
  const textToType = "Hello World";
  await page.getByTestId("editor").fill(textToType);

  const wordCount = await page.getByTestId("word-count").innerText();
  expect(wordCount).toBe(textToType.split(" ").length.toString() + " words");
});

test("it should have eleven buttons in the toolbar", async ({ page }) => {
  const buttons = page.locator("#toolbar > button");
  await expect(buttons).toHaveCount(10);

  const addImageButton = page.locator("#toolbar > label > button");
  await expect(addImageButton).toHaveCount(1);
});

test("it should be possible to edit the title", async ({ page }) => {
  await page.getByTestId("post-title").click();

  const titleField = page.getByTestId("post-title-field");
  await titleField.fill("New Title");
  await page.keyboard.press("Enter");

  const newTitle = await page.getByTestId("post-title").innerText();
  expect(newTitle).toBe("New Title");
});

test("it should have bubble menu when text is selected with 3 buttons", async ({
  page,
}) => {
  const bubbleMenu = page.locator("#bubble-menu");
  await expect(bubbleMenu).not.toBeVisible();

  await page.getByTestId("editor").fill("Hello World");
  await page.getByTestId("editor").selectText();

  await expect(bubbleMenu).toBeVisible();
  await expect(bubbleMenu).toHaveCount(1);

  const buttons = page.locator("#bubble-menu > button");
  await expect(buttons).toHaveCount(3);
});

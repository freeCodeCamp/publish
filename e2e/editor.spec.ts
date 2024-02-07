import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/posts/2");
});

test("it should be possible to type in the editor", async ({ page }) => {
  const editor = page.getByTestId("editor");
  const wordCount = page.getByTestId("word-count");

  await editor.press("Control+A");
  await editor.press("Backspace");
  await expect(wordCount).toHaveText("0 words");

  await editor.pressSequentially("Hello World");
  await expect(wordCount).toHaveText("2 words");
});

test("it should have eleven buttons in the toolbar", async ({ page }) => {
  const buttons = page.locator("#toolbar > button");
  expect(await buttons.count()).toBe(11);
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

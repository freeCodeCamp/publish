import { test, expect } from "@playwright/test";

test.describe("Using Lorem Post 1", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/posts/2"); // Lorem Post 1
  });

  test("it should be possible to type in the editor", async ({ page }) => {
    const textToType = "Hello World";
    await page.getByTestId("editor").fill(textToType);

    const wordCount = await page.getByTestId("word-count").innerText();
    expect(wordCount).toBe(textToType.split(" ").length.toString() + " words");
  });

  test("it should have eleven buttons in the toolbar", async ({ page }) => {
    const buttons = page.locator("#toolbar > button");
    expect(await buttons.count()).toBe(10);

    const addImageButton = page.locator("#toolbar > label > button");
    expect(await addImageButton.count()).toBe(1);
  });

  test("it should be possible to edit the title", async ({ page }) => {
    await page.getByTestId("post-title").click();

    const titleField = page.getByTestId("post-title-field");
    await titleField.fill("New Title");
    await page.keyboard.press("Enter");

    const newTitle = await page.getByTestId("post-title").innerText();
    expect(newTitle).toBe("New Title");
  });
});

test.describe("Using Styled Post", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/posts/1"); // Styled Post
  });

  test("it should toggle inline code", async ({ page }) => {
    // Select the text currently set as inline code
    await page.getByTestId("editor").getByText("Inline Code").click();
    await page.getByTestId("editor").press("Home");
    await page.getByTestId("editor").press("Shift+End");
    // Remove inline code
    await page.getByLabel("Select code").click();
    await page.getByRole("menuitem", { name: "Toggle inline code" }).click();

    // Check that the text was converted to a paragraph
    await expect(
      page.getByTestId("editor").getByRole("code").getByText("Inline Code"),
    ).not.toBeVisible();
    await expect(
      page
        .getByTestId("editor")
        .getByRole("paragraph")
        .getByText("Inline Code"),
    ).toBeVisible();

    // Toggle back to inline code
    await page.getByTestId("editor").getByText("Inline Code").click();
    await page.getByTestId("editor").press("Home");
    await page.getByTestId("editor").press("Shift+End");
    await page.getByLabel("Select code").click();
    await page.getByRole("menuitem", { name: "Toggle inline code" }).click();

    // Check that the text was converted to inline code
    await expect(
      page.getByTestId("editor").getByRole("code").getByText("Inline Code"),
    ).toBeVisible();
  });

  test("it should toggle code block", async ({ page }) => {
    // Select the text currently set as code block
    await page.getByText('"Code Block"').click();
    await page.getByTestId("editor").press("Home");
    await page.getByTestId("editor").press("Shift+End");
    // Remove code block
    await page.getByLabel("Select code").click();
    await page.getByRole("menuitem", { name: "Toggle code block" }).click();

    // Check that the text was converted to a paragraph
    await expect(
      page
        .getByTestId("editor")
        .getByRole("code")
        .getByText('console.log("Code Block");'),
    ).not.toBeVisible();
    await expect(
      page
        .getByTestId("editor")
        .getByRole("paragraph")
        .getByText('console.log("Code Block");'),
    ).toBeVisible();

    // Toggle back to code block
    await page.getByText('"Code Block"').click();
    await page.getByTestId("editor").press("Home");
    await page.getByTestId("editor").press("Shift+End");
    await page.getByLabel("Select code").click();
    await page.getByRole("menuitem", { name: "Toggle code block" }).click();

    // Check that the text was converted to a code block
    await expect(
      page
        .getByTestId("editor")
        .getByRole("code")
        .getByText('console.log("Code Block");'),
    ).toBeVisible();
    await expect(
      page.getByTestId("editor").getByRole("code").getByText("Code Block"),
    ).toHaveClass("hljs-string");
  });

  test("inline code and code block should be mutually exclusive", async ({
    page,
  }) => {
    // Select the text currently set as inline code
    await page.getByTestId("editor").getByText("Inline Code").click();
    await page.getByTestId("editor").press("Home");
    await page.getByTestId("editor").press("Shift+End");
    // Change it to code block
    await page.getByLabel("Select code").click();
    await page.getByRole("menuitem", { name: "Toggle code block" }).click();

    // Should be converted to code block
    await expect(
      page.getByTestId("editor").getByRole("code").getByText("Inline Code"),
    ).toBeVisible();
    // Check that the class specific to code block is present
    await expect(
      page.getByTestId("editor").getByRole("code").getByText("Inline"),
    ).toHaveClass(/hljs-.*/);

    // Select the text currently set as code block
    await page.getByTestId("editor").getByText("Inline Code").click();
    await page.getByTestId("editor").press("Home");
    await page.getByTestId("editor").press("Shift+End");
    // Change it to inline code
    await page.getByLabel("Select code").click();
    await page.getByRole("menuitem", { name: "Toggle inline code" }).click();

    // Should be converted to inline code
    await expect(
      page.getByTestId("editor").getByRole("code").getByText("Inline Code"),
    ).toBeVisible();
    await expect(
      page.getByTestId("editor").getByRole("code").getByText("Inline"),
    ).not.toHaveClass(/hljs-.*/);
  });
});

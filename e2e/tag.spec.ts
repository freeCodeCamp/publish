import { type Page, expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/tags");
});

// Helper function to wait for the tags page to load. This is because waitForURL
// doesn't always work as expected. However, we know that the "New Tag" button
// is always visible on the tags page.
async function waitForTags(page: Page) {
  return await expect(
    page.getByRole("link", { name: "New Tag" })
  ).toBeVisible();
}

test("it should be possible to create and delete a new tag", async ({
  page,
}) => {
  // first create a new tag
  await page.getByRole("link", { name: "New Tag" }).click();

  await page.fill("input[name=name]", "My new tag");
  await page.fill("input[name=slug]", "my-new-tag");

  await page.getByRole("button", { name: "Save" }).click();
  await waitForTags(page);

  // now delete it
  await page.getByText("My new tag").click();

  await page.getByRole("button", { name: "Delete tag" }).click();

  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByText("Are you sure")).toBeHidden();
  await expect(page.getByText("My new tag")).toBeHidden();
});

test("it should be possible to edit a tag", async ({ page }) => {
  await page.getByText("HTML", { exact: true }).click();

  await page.fill("input[name=name]", "HTML - edited");
  await page.getByRole("button", { name: "Save" }).click();
  await waitForTags(page);
  await expect(page.getByText("HTML - edited")).toBeVisible();

  // undo the edit
  await page.getByText("HTML - edited").click();
  await page.fill("input[name=name]", "HTML");
  await page.getByRole("button", { name: "Save" }).click();
});

test("it should be possible to create a new internal tag", async ({ page }) => {
  await page.getByRole("link", { name: "New Tag" }).click();

  await page.fill("input[name=name]", "My new tag");
  await page.fill("input[name=slug]", "my-new-tag");

  await page.check("text=Internal Tag");

  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("radiogroup").getByText("internal tags").click();

  // TODO: delete via api call and just check that it's visible
  await page.getByText("My new tag").click();
  await page.getByRole("button", { name: "Delete tag" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByText("Are you sure")).toBeHidden();
  await expect(page.getByText("My new tag")).toBeHidden();
});

test("it should handle empty name fields correctly", async ({ page }) => {
  await page.getByRole("link", { name: "New Tag" }).click();

  await page.getByRole("button", { name: "Save" }).click();

  await page.getByText("You must specify a name for the tag.").isVisible();
});

// TODO: add handling for empty slug fields

// TODO: add handling for duplicate slug fields

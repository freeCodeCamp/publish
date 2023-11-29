import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/tags");
});

test("it should be possible to create a new tag", async ({ page }) => {
    await page.getByRole("link", { name: "New Tag" }).click();

    await page.fill("input[name=name]", "My new tag 1");
    await page.fill("input[name=slug]", "my-new-tag-1");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("My new tag 1")).toBeVisible();
});

test("it should be possible to edit a tag", async ({ page }) => {
    await page.getByRole("link", { name: "New Tag" }).click();

    await page.fill("input[name=name]", "My new tag 2");
    await page.fill("input[name=slug]", "my-new-tag-2");

    await page.getByRole("button", { name: "Save" }).click();

    await page.getByText("My new tag 2").click();

    await page.fill("input[name=name]", "My new tag 2 - edited");

    await page.getByRole("button", { name: "Save" }).click();

    await expect( page.getByText("My new tag 1 - edited")).toBeVisible();
});

test('it should be possible to delete a tag', async ({ page }) => {
    await page.getByRole("link", { name: "New Tag" }).click();

    await page.fill("input[name=name]", "My new tag 3");
    await page.fill("input[name=slug]", "my-new-tag-3");

    await page.getByRole("button", { name: "Save" }).click();

    await page.getByText("My new tag 3").click();

    await page.getByRole("button", { name: "Delete tag" }).click();

    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("Are you sure")).toBeHidden();
    await expect(page.getByText("My new tag 3")).toBeHidden();
})

test("it should be possible to create a new internal tag", async ({ page }) => {
    await page.getByRole("link", { name: "New Tag" }).click();

    await page.fill("input[name=name]", "My new tag 4");
    await page.fill("input[name=slug]", "my-new-tag-4");

    await page.check('text=Internal Tag');

    await page.getByRole("button", { name: "Save" }).click();

    await page.getByText("Internal Tags").click()

    await page.getByText("My new tag 4").isVisible();
});

test("it should handle empty name fields correctly", async ({ page }) => {
    await page.getByRole("link", { name: "New Tag" }).click();

    await page.getByRole("button", { name: "Save" }).click();

    await page.getByText("You must specify a name for the tag.").isVisible();
});


// TODO: add handling for empty slug fields

// TODO: add handling for duplicate slug fields




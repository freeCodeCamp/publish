import { test } from "@playwright/test";

test("it should be possible to create a new tag", async ({ page }) => {
    await page.goto("/tags");
    
    await page.getByRole("link", { name: "New Tag" }).click();

    await page.fill("input[name=name]", "My new tag 1");
    await page.fill("input[name=slug]", "my-new-tag-1");

    await page.getByRole("button", { name: "Save" }).click();

    await page.waitForTimeout(1000);

    await page.goto("/tags");

    await page.getByText("My new tag 1").isVisible();
});

test("it should be possible to edit a tag", async ({ page }) => {

    await page.goto("/tags");

    await page.getByText("My new tag 1").click();   

    await page.fill("input[name=name]", "My new tag 1 - edited");

    await page.getByRole("button", { name: "Save" }).click();

    await page.waitForTimeout(1000);

    await page.goto("/tags");

    await page.getByText("My new tag 1 - edited").isVisible();
});

test('it should be possible to delete a tag', async ({ page }) => {
    
    await page.goto("/tags");

    await page.getByText("My new tag 1").click();   

    await page.getByRole("button", { name: "Delete tag" }).click();

    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: "Delete" }).click();

    await page.waitForTimeout(1000);
    
    await page.getByText("My new tag 1").isHidden(); 
    
})

test("it should be possible to create a new internal tag", async ({ page }) => {
    await page.goto("/tags");
    
    await page.getByRole("link", { name: "New Tag" }).click();

    await page.fill("input[name=name]", "My new tag 2");
    await page.fill("input[name=slug]", "my-new-tag-2");

    await page.check('text=Internal Tag');

    await page.getByRole("button", { name: "Save" }).click();

    await page.waitForTimeout(1000);

    await page.goto("/tags?visibility=internal&page=1");

    await page.getByText("My new tag 2").isVisible();
});






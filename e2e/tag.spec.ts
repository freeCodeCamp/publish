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






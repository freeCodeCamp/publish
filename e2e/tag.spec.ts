import { test, expect } from "@playwright/test";

test("it should be possible to create a new internal tag", async ({ page }) => {
    await page.goto("/tags");
    
    await page.getByRole("link", { name: "New Tag" }).click();

    await page.fill("input[name=name]", "My new tag");
    await page.fill("input[name=slug]", "my-new-tag");

    await page.check('text=Internal Tag');

    await page.getByRole("button", { name: "Save" }).click();

    await page.waitForSelector("text=Tag Created.");

    await page.goto("/tags?visibility=internal&page=1");

    await page.getByText("My new tag").isVisible();
});




import { test as setup } from "@playwright/test";

import { signIn } from "./helpers/user";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await signIn(page, { identifier: "editor@user.com", password: "editor" });
  // Wait until the page receives the cookies.

  await page.waitForURL("**/posts");
  await page.context().storageState({ path: authFile });
});

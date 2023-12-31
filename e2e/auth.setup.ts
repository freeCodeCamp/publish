import { test as setup } from "@playwright/test";

import { signIn } from "./helpers/user";
import {
  EDITOR_CREDENTIALS,
  CONTRIBUTOR_CREDENTIALS,
} from "./helpers/constants";

const editorFile = "playwright/.auth/editor.json";
const contributorFile = "playwright/.auth/contributor.json";

setup("authenticate as editor", async ({ page }) => {
  await signIn(page, EDITOR_CREDENTIALS);
  await page.context().storageState({ path: editorFile });
});

setup("authenticate as contributor", async ({ page }) => {
  await signIn(page, CONTRIBUTOR_CREDENTIALS);
  await page.context().storageState({ path: contributorFile });
});

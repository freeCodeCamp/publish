import { test, expect } from "@playwright/test";

import { UsersPage } from "./pages/users";
import { getBearerToken, useCredentialsForAuth, signIn, deleteUser } from "./helpers/user";

import { EDITOR_CREDENTIALS } from "./helpers/constants";

const NEW_USER_CREDENTIALS = {
  identifier: "new@user.com",
  password: "password",
};

test.describe("inviting a user", () => {
  test.afterEach(async ({ request }) => {
    // Delete the user if it exists
    await deleteUser(request, {
      ...NEW_USER_CREDENTIALS,
      jwt: await getBearerToken(request, EDITOR_CREDENTIALS),
    });
  });
  test("invitations can be created and revoked", async ({ browser }) => {
    // To avoid using the invitee's credentials, we have to create a new context
    const editorContext = await browser.newContext({
      storageState: "playwright/.auth/editor.json",
    });
    const usersPage = new UsersPage(await editorContext.newPage());
    await usersPage.goto();

    await usersPage.inviteUser(NEW_USER_CREDENTIALS.identifier);
    await expect(
      await usersPage.getInvitedUser(NEW_USER_CREDENTIALS.identifier)
    ).toBeVisible();

    await usersPage.revokeUser(NEW_USER_CREDENTIALS.identifier);
    await expect(
      await usersPage.getInvitedUser(NEW_USER_CREDENTIALS.identifier)
    ).toBeHidden();
  });

  test("invited users become active by signing in", async ({
    page,
    request,
    browser,
  }) => {
    // To avoid using the invitee's credentials, we have to create a new context
    const editorContext = await browser.newContext({
      storageState: "playwright/.auth/editor.json",
    });
    const usersPage = new UsersPage(await editorContext.newPage());
    await usersPage.goto();
    await usersPage.inviteUser(NEW_USER_CREDENTIALS.identifier);

    // Allow the user to sign in with email/password, not Auth0.
    await useCredentialsForAuth(request, {
      ...NEW_USER_CREDENTIALS,
      jwt: await getBearerToken(request, EDITOR_CREDENTIALS),
    });

    await signIn(page, NEW_USER_CREDENTIALS);

    // After signing in, the invited user should be in the active list
    await usersPage.page.reload();
    await expect(
      await usersPage.getActiveUser(NEW_USER_CREDENTIALS.identifier)
    ).toBeVisible();
  });
});

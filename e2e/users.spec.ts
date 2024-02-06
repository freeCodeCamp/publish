import { test, expect } from "@playwright/test";

import { UsersPage } from "./pages/users";
import { useCredentialsForAuth, signIn, deleteUser } from "./helpers/user";

const NEW_USER_CREDENTIALS = {
  identifier: "new@user.com",
  password: "password",
};

test.describe("inviting a user", () => {
  let usersPage: UsersPage;

  test.beforeEach(async ({ browser }) => {
    // To avoid using the invitee's credentials, we have to create a new context
    const editorContext = await browser.newContext({
      storageState: "playwright/.auth/editor.json",
    });
    usersPage = new UsersPage(await editorContext.newPage());
    await usersPage.goto();
  });

  test.afterEach(async ({ request }) => {
    // Delete the user if it exists
    await deleteUser(request, NEW_USER_CREDENTIALS);
  });

  test("invitations can be created and revoked", async () => {
    await usersPage.inviteUser(NEW_USER_CREDENTIALS.identifier);
    await expect(
      usersPage.getInvitedUser(NEW_USER_CREDENTIALS.identifier),
    ).toBeVisible();

    await usersPage.revokeUser(NEW_USER_CREDENTIALS.identifier);
    await expect(
      usersPage.getInvitedUser(NEW_USER_CREDENTIALS.identifier),
    ).toBeHidden();
  });

  test("invited users become active by signing in", async ({
    page,
    request,
  }) => {
    await usersPage.inviteUser(NEW_USER_CREDENTIALS.identifier);

    // Allow the user to sign in with email/password, not Auth0.
    await useCredentialsForAuth(request, NEW_USER_CREDENTIALS);

    await signIn(page, NEW_USER_CREDENTIALS);

    // After signing in, the invited user should be in the active list
    await usersPage.page.reload();
    await expect(
      usersPage.getActiveUser(NEW_USER_CREDENTIALS.identifier),
    ).toBeVisible();
  });
});

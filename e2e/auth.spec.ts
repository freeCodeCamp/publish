import { test, expect, APIRequestContext } from "@playwright/test";

import { getBearerToken, getUserByEmail, signIn } from "./helpers/user";
import {
  API_URL,
  EDITOR_CREDENTIALS,
  INVITEE_CREDENTIALS,
} from "./helpers/constants";

// Reset storage state for this file to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("first sign in", () => {
  let updateUserUrl: string;
  let editorJWT: string;

  const resetInvitedUser = async (request: APIRequestContext) =>
    await request.put(updateUserUrl, {
      headers: {
        Authorization: `Bearer ${editorJWT}`,
      },
      data: { status: "invited" },
    });

  test.beforeAll(async ({ request }) => {
    editorJWT = await getBearerToken(request, EDITOR_CREDENTIALS);
    const invitedUser = await getUserByEmail(request, {
      email: INVITEE_CREDENTIALS.identifier,
      jwt: editorJWT,
    });
    updateUserUrl = `${API_URL}/api/users/${invitedUser.id}`;
  });
  test.beforeEach(async ({ request }) => await resetInvitedUser(request));
  test.afterAll(async ({ request }) => await resetInvitedUser(request));

  test("sets the user as 'active'", async ({ page, request }) => {
    const originalUserRes = await request.get(updateUserUrl, {
      headers: {
        Authorization: `Bearer ${editorJWT}`,
      },
    });
    expect(await originalUserRes.json()).toMatchObject({ status: "invited" });

    await signIn(page, INVITEE_CREDENTIALS);

    const userRes = await request.get(updateUserUrl, {
      headers: {
        Authorization: `Bearer ${editorJWT}`,
      },
    });
    expect(await userRes.json()).toMatchObject({ status: "active" });
  });

  test("signing in converts invited users to active ones", async ({
    browser,
    page,
  }) => {
    // To avoid using the invitee's credentials, we have to create a new context
    const editorContext = await browser.newContext({
      storageState: "playwright/.auth/editor.json",
    });
    const editorPage = await editorContext.newPage();

    // Initially the invited user should be in the invited list
    await editorPage.goto("/users");
    const invitedUser = editorPage
      .getByTestId("invited-user")
      .getByText(INVITEE_CREDENTIALS.identifier);
    await expect(invitedUser).toBeVisible();

    await signIn(page, INVITEE_CREDENTIALS);

    // After signing in, the invited user should be in the active list
    await editorPage.reload();
    const activeUser = editorPage
      .getByTestId("active-user")
      .getByText(INVITEE_CREDENTIALS.identifier);
    await expect(activeUser).toBeVisible();
  });
});

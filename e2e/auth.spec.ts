import { test, expect, APIRequestContext } from "@playwright/test";

import { getBearerToken, getUserByUsername, signIn } from "./helpers/user";
import { API_URL } from "./helpers/constants";

// Reset storage state for this file to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("first sign in", () => {
  let updateUserUrl: string;
  let editorJWT: string;

  const resetInvitedUser = (request: APIRequestContext) =>
    request.put(updateUserUrl, {
      headers: {
        Authorization: `Bearer ${editorJWT}`,
      },
      data: { status: "invited" },
    });

  test.beforeAll(async ({ request }) => {
    editorJWT = await getBearerToken(request, {
      identifier: "editor@user.com",
      password: "editor",
    });
    const invitedUser = await getUserByUsername(request, {
      username: "invited-user",
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

    await signIn(page, { identifier: "invited@user.com", password: "invited" });

    const userRes = await request.get(updateUserUrl, {
      headers: {
        Authorization: `Bearer ${editorJWT}`,
      },
    });
    expect(await userRes.json()).toMatchObject({ status: "active" });
  });
});

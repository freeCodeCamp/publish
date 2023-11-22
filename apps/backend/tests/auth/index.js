"use strict";
const request = require("supertest");
const { getUser, getUserJWT, deleteUser } = require("../helpers/helpers");

// user mock data
const mockUserData = {
  username: "tester",
  email: "tester@strapi.com",
  provider: "local",
  password: "1234abc",
  confirmed: true,
  blocked: null,
};

describe("auth", () => {
  describe("invitation", () => {
    let mockUser;
    let sendEmailSpy;
    let editorToken;

    beforeEach(async () => {
      sendEmailSpy = jest
        .spyOn(strapi.plugins.email.services.email, "send")
        .mockImplementation(jest.fn());
      mockUser =
        await strapi.plugins["users-permissions"].services.user.add(
          mockUserData,
        );
      editorToken = await getUserJWT("editor-user");
    });

    afterEach(() => {
      deleteUser(mockUserData.username);
      jest.clearAllMocks();
    });

    it("should set the user's provider to auth0 and delete the password", async () => {
      // There are subtle differences between what services.user.add and
      // getUser return, so we use getUser for a fair comparison.
      const user = await getUser(mockUserData.username);

      const res = await request(strapi.server.httpServer)
        .put("/api/auth/invitation/" + user.id)
        .auth(editorToken, { type: "bearer" });

      expect(res.body).toEqual({ status: "success" });
      expect(res.status).toEqual(200);
      const updatedUser = await getUser(user.username);
      expect(updatedUser).toEqual({
        ...user,
        provider: "auth0",
        updatedAt: updatedUser.updatedAt,
        password: null,
      });
    });

    it("should email the invited user", async () => {
      const res = await request(strapi.server.httpServer)
        .put("/api/auth/invitation/" + mockUser.id)
        .auth(editorToken, { type: "bearer" });

      expect(res.body).toEqual({ status: "success" });
      expect(res.status).toEqual(200);
      expect(sendEmailSpy).toHaveBeenCalledTimes(1);
      expect(sendEmailSpy).toHaveBeenCalledWith({
        to: mockUserData.email,
        from: "support@freecodecamp.org",
        subject: "Invitation Link",
        text: `Here is your invitation link: http://localhost:3000/api/auth/signin`,
      });
    });

    // This should happen irrespective of what we do with their password. i.e.
    // we null it, but even if we didn't they should not be able to login.
    it("should prevent email password login", async () => {
      const loginResponse = await request(strapi.server.httpServer)
        .post("/api/auth/local")
        .send({
          identifier: mockUserData.email,
          password: mockUserData.password,
        });
      expect(loginResponse.status).toEqual(200);

      await request(strapi.server.httpServer)
        .put("/api/auth/invitation/" + mockUser.id)
        .auth(editorToken, { type: "bearer" });

      const deniedLoginResponse = await request(strapi.server.httpServer)
        .post("/api/auth/local")
        .send({
          identifier: mockUserData.email,
          password: mockUserData.password,
        });

      expect(deniedLoginResponse.body.error.message).toEqual(
        "Invalid identifier or password",
      );
      expect(deniedLoginResponse.status).toEqual(400);
    });

    // TODO: enable once the administrator role exists.
    it.skip("should reject requests from other roles", async () => {
      // TODO: fetch all roles and test them directly (better future proofing)
      const forbiddenUsers = ["contributor-user", "editor-user"];

      for (const username of forbiddenUsers) {
        const token = await getUserJWT(username);
        const res = await request(strapi.server.httpServer)
          .put("/api/auth/invitation/" + mockUser.id)
          .auth(token, { type: "bearer" });
        expect(res.status).toEqual(403);
      }

      const res = await request(strapi.server.httpServer).put(
        "/api/auth/invitation/" + mockUser.id,
      );

      expect(res.status).toEqual(403);
    });
  });
});

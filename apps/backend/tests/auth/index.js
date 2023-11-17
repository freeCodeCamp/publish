"use strict";
const request = require("supertest");
const { getUser, getUserJWT } = require("../helpers/helpers");

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
    it("should set the user's provider to auth0", async () => {
      await strapi.plugins["users-permissions"].services.user.add({
        ...mockUserData,
      });
      // There are subtle differences between what services.user.add and
      // getUser return, so we use getUser for a fair comparison.
      const user = await getUser(mockUserData.username);
      // TODO: only allow admin
      const editorToken = await getUserJWT("editor-user");

      const res = await request(strapi.server.httpServer)
        .put("/api/auth/invitation/" + user.id)
        .auth(editorToken, { type: "bearer" });

      expect(res.status).toEqual(200);
      expect(res.body).toEqual({ status: "success" });
      const updatedUser = await getUser(user.username);
      expect(updatedUser).toEqual({
        ...user,
        provider: "auth0",
        updatedAt: updatedUser.updatedAt,
      });
    });
  });
});

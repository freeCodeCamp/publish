"use strict";
const request = require("supertest");
const {
  getUser,
  getUserJWT,
  deleteUser,
  getAllRoles,
  getUserByRole,
  getRoleId,
} = require("../helpers/helpers");

// user mock data
const mockUserData = {
  username: "tester",
  email: "tester@strapi.com",
  provider: "local",
  password: "1234abc",
  confirmed: true,
  blocked: null,
};

const invitedUserData = {
  username: "invited",
  email: "invited@user.com",
  provider: "auth0",
  confirmed: false,
  status: "invited",
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

    it('should modify the user object into the "invited" state', async () => {
      // There are subtle differences between what services.user.add and
      // getUser return, so we use getUser for a fair comparison.
      const user = await getUser(mockUserData.username);

      const res = await request(strapi.server.httpServer)
        .put("/api/auth/invitation/" + user.id)
        .auth(editorToken, { type: "bearer" });

      expect(res.body).toEqual({ status: "success" });
      expect(res.status).toEqual(200);
      const updatedUser = await getUser(user.username);
      expect(updatedUser).toMatchObject({
        ...user,
        provider: "auth0",
        updatedAt: updatedUser.updatedAt,
        password: null,
        status: "invited",
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

    // There is only one role for now, but this is designed to make sure we get
    // warned before allowing new roles to invite users.
    it("should reject requests from other role(s)", async () => {
      const allRoles = await getAllRoles();
      const forbiddenRoles = allRoles.filter(
        ({ type }) => type !== "authenticated",
      );

      for (const role of forbiddenRoles) {
        const user = await getUserByRole(role.id);
        const token = await getUserJWT(user.username);
        const res = await request(strapi.server.httpServer)
          .put("/api/auth/invitation/" + mockUser.id)
          .auth(token, { type: "bearer" });
        if (res.status !== 403) {
          throw new Error(
            `Expected ${role.name} to be forbidden but it returned status: ${res.status}`,
          );
        }
      }
    });
  });

  describe("accept-invitation", () => {
    afterEach(() => {
      deleteUser(invitedUserData.username);
    });

    // TODO: loop over all roles after fetching them with getAllRoles
    const roles = ["Editor", "Contributor"];

    roles.forEach((role) => {
      it(`should set a ${role} user as active if they are not already`, async () => {
        const roleId = await getRoleId(role);
        await strapi.plugins["users-permissions"].services.user.add({
          ...invitedUserData,
          role: roleId,
        });

        const invitedUserToken = await getUserJWT(invitedUserData.username);

        const res = await request(strapi.server.httpServer)
          .put("/api/auth/accept-invitation")
          .auth(invitedUserToken, { type: "bearer" });

        expect(res.status).toEqual(200);
        expect(res.body).toEqual({ status: "success" });
        const updatedUser = await getUser(invitedUserData.username);
        expect(updatedUser.status).toEqual("active");
      });
    });
  });
});

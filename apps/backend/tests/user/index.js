const request = require("supertest");
const {
  deleteUser,
  getAllRoles,
  getUserByRole,
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

describe("user", () => {
  // Example test taken from https://docs.strapi.io/dev-docs/testing
  // This test should pass if the test environment is set up properly
  afterAll(async () => {
    await deleteUser(mockUserData.username);
  });
  it("should login user and return jwt token", async () => {
    /** Creates a new user and save it to the database */
    await strapi.plugins["users-permissions"].services.user.add({
      ...mockUserData,
    });

    await request(strapi.server.httpServer) // app server is an instance of Class: http.Server
      .post("/api/auth/local")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        identifier: mockUserData.email,
        password: mockUserData.password,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.jwt).toBeDefined();
      });
  });

  // This just ensures that the test environment is set up with all types of
  // user.
  it("should have a user for each of the roles", async () => {
    const roles = await getAllRoles();
    for (const role of roles) {
      const user = await getUserByRole(role.id);
      expect(user).toMatchObject({
        role: {
          name: role.name,
        },
      });
    }
  });
});

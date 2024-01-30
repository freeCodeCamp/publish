const request = require("supertest");
const {
  deleteUser,
  getUserByRole,
  getAllRoles,
  getUser,
  getUserJWT,
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

let contributorJWT = "";
let editorJWT = "";

beforeAll(async () => {
  // Prepare user token
  contributorJWT = await getUserJWT("contributor-user");
  editorJWT = await getUserJWT("editor-user");
});

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

  describe("Contributors getting user data", () => {
    // Due to Strapi's permission system, if we desable the /users or /users/:id endpoint,
    // it will also disable population of the user data in other endpoints.
    // (e.g. /posts?populate[0]=author)
    // Therefore, we are filtering out the email field in the response
    // instead of disabling the entire endpoint.

    it("GET /users should not return email to contributors", async () => {
      const response = await request(strapi.server.httpServer)
        .get(`/api/users`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send();

      expect(response.status).toBe(200);
      // check that email and username are not present in the response
      expect(response.body.every((user) => !user.email && !user.username)).toBe(
        true,
      );
    });

    it("GET /users/:id should not return email to contributors", async () => {
      const editorUser = await getUser("editor-user");

      const response = await request(strapi.server.httpServer)
        .get(`/api/users/${editorUser.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send();

      expect(response.status).toBe(200);

      // check that email and username are not present in the response
      expect(response.body).not.toHaveProperty("email");
      expect(response.body).not.toHaveProperty("username");
    });
  });

  describe("Editors getting user data", () => {
    it("GET /users should return email to editors", async () => {
      const response = await request(strapi.server.httpServer)
        .get(`/api/users`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${editorJWT}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.every((user) => user.email && !user.username)).toBe(
        true,
      );
    });

    it("GET /users/:id should return email to editors", async () => {
      const contributorUser = await getUser("contributor-user");

      const response = await request(strapi.server.httpServer)
        .get(`/api/users/${contributorUser.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${editorJWT}`)
        .send();

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty("email");
      expect(response.body).not.toHaveProperty("username");
    });
  });
});

const fs = require("fs");
const { setupStrapi, cleanupStrapi } = require("./helpers/strapi");
const {
  createTestUsers,
  createTestTags,
  createTestPosts,
} = require("./helpers/data.helper");
const { testUsers, testTags, testPosts } = require("./helpers/fixtures");

beforeAll(async () => {
  // Create a Strapi instance in the testing environment
  await setupStrapi();

  // Seed test database
  await createTestUsers(testUsers);
  await createTestTags(testTags);
  await createTestPosts(testPosts);
});

afterAll(cleanupStrapi);

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});

require("./user");
require("./custom-post");

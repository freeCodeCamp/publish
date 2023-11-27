const { setupStrapi, cleanupStrapi } = require("./helpers/strapi");
const {
  createTestUsers,
  createTestTags,
  createTestPosts,
} = require("./helpers/data.helper");
const { setupFixtures } = require("./helpers/fixtures");

beforeAll(async () => {
  // Create a Strapi instance in the testing environment
  await setupStrapi();

  // Get fixtures
  const fixtures = await setupFixtures();

  // Seed test database
  const users = await createTestUsers(fixtures.testUsers);
  const tags = await createTestTags(fixtures.testTags);
  await createTestPosts(fixtures.getTestPostsData, users, tags);
});

afterAll(cleanupStrapi);

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});

require("./user");
require("./auth");
require("./custom-post");
require("./post");

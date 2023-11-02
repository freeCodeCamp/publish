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
  await createTestUsers(fixtures.testUsers);
  await createTestTags(fixtures.testTags);
  await createTestPosts(fixtures.testPosts);
});

afterAll(cleanupStrapi);

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});

require("./user");
require("./custom-post");
require("./post");

// helper functions to seed the test database

const createTestUsers = async (testUsers) => {
  try {
    for (const user of testUsers) {
      await strapi.entityService.create("plugin::users-permissions.user", {
        data: {
          ...user,
        },
      });
    }
  } catch (e) {
    console.error(e);
    throw new Error("Failed to create mock users");
  }
};

const createTestTags = async (testTags) => {
  try {
    for (const tag of testTags) {
      await strapi.entityService.create("api::tag.tag", {
        data: {
          ...tag,
        },
      });
    }
  } catch (e) {
    console.error(e);
    throw new Error("Failed to create mock tags");
  }
};

const createTestPosts = async (testPosts) => {
  try {
    for (const post of testPosts) {
      await strapi.entityService.create("api::post.post", {
        data: {
          ...post,
        },
      });
    }
  } catch (e) {
    console.error(e);
    throw new Error("Failed to create mock posts");
  }
};
module.exports = {
  createTestUsers,
  createTestTags,
  createTestPosts,
};

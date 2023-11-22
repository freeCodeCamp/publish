// helper functions to seed the test database

const createTestUsers = async (testUsers) => {
  const editor = await strapi.entityService.create(
    "plugin::users-permissions.user",
    { data: testUsers.editor },
  );
  const contributor = await strapi.entityService.create(
    "plugin::users-permissions.user",
    { data: testUsers.contributor },
  );

  return {
    editor,
    contributor,
  };
};

const createTestTags = async (testTags) => {
  const html = await strapi.entityService.create("api::tag.tag", {
    data: testTags.html,
  });
  const css = await strapi.entityService.create("api::tag.tag", {
    data: testTags.css,
  });

  return {
    html,
    css,
  };
};

const createTestPosts = async (generateTestPosts, users, tags) => {
  const testPosts = await generateTestPosts(users, tags);

  for (const data of testPosts) {
    await strapi.entityService.create("api::post.post", {
      data,
    });
  }
};

module.exports = {
  createTestUsers,
  createTestTags,
  createTestPosts,
};

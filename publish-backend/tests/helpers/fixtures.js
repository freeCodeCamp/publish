const { getRoleId } = require("./helpers");

const setupFixtures = async () => {
  const contributor = await getRoleId("Contributor");
  const editor = await getRoleId("Editor");

  const fixtures = {
    testUsers: [
      {
        name: "Contributor User",
        slug: "contributor-user",
        username: "contributor-user",
        email: "contributor@example.com",
        password: "contributor",
        confirmed: true,
        role: {
          connect: [contributor],
        },
      },
      {
        name: "Editor User",
        slug: "editor-user",
        username: "editor-user",
        email: "editor@example.com",
        password: "editor",
        confirmed: true,
        role: {
          connect: [editor],
        },
      },
    ],
    testTags: [
      {
        name: "HTML",
        slug: "html",
      },
      {
        name: "CSS",
        slug: "css",
      },
    ],
    testPosts: [
      {
        title: "Test Title",
        body: "<p>test body</p>",
        slug: "test-slug",
        publishedAt: new Date("2023-08-30T00:00:00.000Z"),
        author: {
          connect: [1],
        },
        tags: {
          connect: [1, 2],
        },
      },
      {
        title: "test title 2",
        body: "<p>test body 2</p>",
        slug: "test-slug-2",
        publishedAt: new Date("2023-08-30T04:09:32.928Z"),
        author: { connect: [1] },
      },
      {
        title: "Draft Post",
        body: "<p>draft post</p>",
        slug: "draft-post",
        publishedAt: null,
        publish_at: null,
        author: {
          connect: [1],
        },
        tags: {
          connect: [1, 2],
        },
      },
    ],
  };

  return fixtures;
};

module.exports = {
  setupFixtures,
};

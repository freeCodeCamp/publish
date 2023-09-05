module.exports = {
  testUsers: [
    {
      name: "Test User",
      slug: "test-user",
      username: "foo@bar.com",
      email: "foo@bar.com",
      password: "foobar",
      confirmed: true,
      role: {
        connect: [3],
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
  ],
};

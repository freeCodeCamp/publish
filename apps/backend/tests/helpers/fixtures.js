const { getRoleId } = require("./helpers");

const setupFixtures = async () => {
  const contributor = await getRoleId("Contributor");
  const editor = await getRoleId("Editor");

  const fixtures = {
    testUsers: {
      contributor: {
        name: "Contributor User",
        slug: "contributor-user",
        username: "contributor-user",
        email: "contributor@example.com",
        password: "contributor",
        status: "active",
        confirmed: true,
        role: {
          connect: [contributor],
        },
      },
      editor: {
        name: "Editor User",
        slug: "editor-user",
        username: "editor-user",
        email: "editor@example.com",
        password: "editor",
        status: "active",
        confirmed: true,
        role: {
          connect: [editor],
        },
      },
    },
    testTags: {
      html: {
        name: "HTML",
        slug: "html",
      },
      css: {
        name: "CSS",
        slug: "css",
      },
    },
    getTestPostsData({ editor, contributor }, { html, css }) {
      return [
        {
          title: "Test Title",
          body: "<p>test body</p>",
          slug: "test-slug",
          publishedAt: new Date("2023-08-30T00:00:00.000Z"),
          code_injection_head:
            '<script> const fCCOriginalPost = "https://www.freecodecamp.org/news/about/"; </script>',
          author: {
            connect: [contributor.id],
          },
          tags: {
            connect: [html.id, css.id],
          },
        },
        {
          title: "test title 2",
          body: "<p>test body 2</p>",
          slug: "test-slug-2",
          publishedAt: new Date("2023-08-30T04:09:32.928Z"),
          author: { connect: [contributor.id] },
        },
        {
          title: "Draft Post",
          body: "<p>draft post</p>",
          slug: "draft-post",
          publishedAt: null,
          scheduled_at: null,
          author: {
            connect: [contributor.id],
          },
          tags: {
            connect: [html.id, css.id],
          },
        },
        {
          title: "Published Post",
          body: "<p>published post</p>",
          slug: "published-post",
          publishedAt: null,
          scheduled_at: null,
          author: {
            connect: [contributor.id],
          },
          tags: {
            connect: [html.id, css.id],
          },
        },
        {
          title: "Editor's draft post",
          body: "<p>This is a post by editor user.</p>",
          slug: "editors-draft-post",
          publishedAt: null,
          author: {
            connect: [editor.id],
          },
          tags: {
            connect: [html.id, css.id],
          },
        },
      ];
    },
  };

  return fixtures;
};

module.exports = {
  setupFixtures,
};

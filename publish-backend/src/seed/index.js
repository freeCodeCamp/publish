const { faker } = require("@faker-js/faker");

async function createSeedUsers(strapi) {
  await strapi.entityService.create("plugin::users-permissions.user", {
    data: {
      username: "contributor-user",
      email: "contributor@user.com",
      password: "contributor",
      provider: "local",
      confirmed: true,
      role: {
        connect: [3],
      },
    },
  });
  await strapi.entityService.create("plugin::users-permissions.user", {
    data: {
      username: "editor-user",
      email: "editor@user.com",
      password: "editor",
      provider: "local",
      confirmed: true,
      role: {
        connect: [1],
      },
    },
  });
}

async function createSeedInvitedUsers(strapi) {
  await strapi.entityService.create("api::invited-user.invited-user", {
    data: {
      email: "contributor@user.com",
    },
  });
  await strapi.entityService.create("api::invited-user.invited-user", {
    data: {
      email: "editor@user.com",
    },
  });
}

async function createSeedTags(strapi) {
  await strapi.entityService.create("api::tag.tag", {
    data: {
      name: "HTML",
    },
  });
  await strapi.entityService.create("api::tag.tag", {
    data: {
      name: "CSS",
    },
  });
  await strapi.entityService.create("api::tag.tag", {
    data: {
      name: "JS",
    },
  });
  await strapi.entityService.create("api::tag.tag", {
    data: {
      name: "Python",
    },
  });
  await strapi.entityService.create("api::tag.tag", {
    data: {
      name: "Internal",
      visibility: "internal",
    },
  });
}

async function createSeedPosts(strapi) {
  await strapi.entityService.create("api::post.post", {
    data: {
      title: "Styled Post",
      author: { connect: [1] },
      tags: { connect: [1, 2, 3] },
      body: '<p><strong>Bold</strong></p>\n\n<p><em>Italic</em></p>\n\n<p><s>Strike</s></p>\n\n<p><code>Code</code></p>\n\n<blockquote>"Quote"</blockquote>\n\n<h1>H1</h1>\n\n<h2>H2</h2>\n\n<h3>H3</h3>\n\n<ul>\n<li>Bullet</li>\n</ul>\n\n<ol>\n<li>Ordered</li>\n\n<li>Ordered</li>\n</ol>',
      publishedAt: new Date(),
    },
  });
  await strapi.entityService.create("api::post.post", {
    data: {
      title: "Lorem Post 1",
      author: { connect: [1] },
      tags: { connect: [1, 2, 4] },
      body: faker.lorem.paragraphs(5, "<br/>\n"),
      publishedAt: new Date(),
    },
  });
  await strapi.entityService.create("api::post.post", {
    data: {
      title: "Lorem Post 2",
      author: { connect: [2] },
      tags: { connect: [2, 3] },
      body: faker.lorem.paragraphs(5, "<br/>\n"),
      publishedAt: new Date(),
    },
  });
  await strapi.entityService.create("api::post.post", {
    data: {
      title: "Unpublished Lorem Post",
      author: { connect: [2] },
      tags: { connect: [2, 3] },
      body: faker.lorem.paragraphs(5, "<br/>\n"),
    },
  });
  await strapi.entityService.create("api::post.post", {
    data: {
      title: "Internal post",
      author: { connect: [2] },
      tags: { connect: [5] },
      body: "I'm an internal post and meant to be hidden",
      publishedAt: new Date(),
    },
  });
}

async function generateSeedData(strapi) {
  const dataExists = await strapi.entityService.findMany(
    "plugin::users-permissions.user",
    {
      filters: {
        $or: [
          {
            email: "foo@bar.com",
          },
          {
            email: "dev@user.com",
          },
        ],
      },
    }
  );

  if (dataExists.length > 0) {
    console.log("Seed data already exists, skipping...");
    return;
  }
  console.log("Creating seed data...");

  await createSeedUsers(strapi);
  await createSeedInvitedUsers(strapi);
  await createSeedTags(strapi);
  await createSeedPosts(strapi);
}

module.exports = {
  generateSeedData,
};

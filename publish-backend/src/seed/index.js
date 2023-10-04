const { faker } = require("@faker-js/faker");

let userIds = []; // For now first user will be contributor and second will be editor
let tagIds = [];
let internalTagId = null;

const findRoleId = async (strapi, roleName) => {
  try {
    const role = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({
        where: { name: roleName },
      });
    return role.id;
  } catch (e) {
    console.error(e);
    throw new Error(`Failed to get Role ID for ${roleName}`);
  }
};

async function createSeedUsers(strapi) {
  const contributor = await findRoleId(strapi, "Contributor");
  const editor = await findRoleId(strapi, "Editor");
  const userRes1 = await strapi.entityService.create(
    "plugin::users-permissions.user",
    {
      data: {
        username: "contributor-user",
        name: "contributor-user",
        email: "contributor@user.com",
        password: "contributor",
        provider: "local",
        confirmed: true,
        role: {
          connect: [contributor],
        },
      },
    }
  );
  const userRes2 = await strapi.entityService.create(
    "plugin::users-permissions.user",
    {
      data: {
        username: "editor-user",
        name: "editor-user",
        email: "editor@user.com",
        password: "editor",
        provider: "local",
        confirmed: true,
        role: {
          connect: [editor],
        },
      },
    }
  );
  userIds = [userRes1.id, userRes2.id];
}

async function createSeedInvitedUsers(strapi) {
  const contributor = await findRoleId(strapi, "Contributor");
  const editor = await findRoleId(strapi, "Editor");
  await strapi.entityService.create("api::invited-user.invited-user", {
    data: {
      email: "contributor@user.com",
      accepted: "true",
      role: {
        connect: [contributor],
      },
    },
  });
  await strapi.entityService.create("api::invited-user.invited-user", {
    data: {
      email: "editor@user.com",
      accepted: "true",
      role: {
        connect: [editor],
      },
    },
  });
  await strapi.entityService.create("api::invited-user.invited-user", {
    data: {
      email: "invited@user.com",
      role: {
        connect: [contributor],
      },
    },
  });
}

async function createSeedTags(strapi) {
  const tagRes1 = await strapi.entityService.create("api::tag.tag", {
    data: {
      name: "HTML",
      slug: "html",
    },
  });
  const tagRes2 = await strapi.entityService.create("api::tag.tag", {
    data: {
      name: "CSS",
      slug: "css",
    },
  });
  const tagRes3 = await strapi.entityService.create("api::tag.tag", {
    data: {
      name: "JS",
      slug: "js",
    },
  });
  const tagRes4 = await strapi.entityService.create("api::tag.tag", {
    data: {
      name: "Python",
      slug: "python",
    },
  });
  const internalTagRes = await strapi.entityService.create("api::tag.tag", {
    data: {
      name: "Internal",
      visibility: "internal",
      slug: "internal",
    },
  });
  tagIds = [tagRes1.id, tagRes2.id, tagRes3.id, tagRes4.id];
  internalTagId = internalTagRes.id;
}

async function createSeedPosts(strapi) {
  await strapi.entityService.create("api::post.post", {
    data: {
      title: "Styled Post",
      author: { connect: [userIds[0]] },
      tags: { connect: tagIds.slice(0, 3) },
      body: '<p><strong>Bold</strong></p>\n\n<p><em>Italic</em></p>\n\n<p><s>Strike</s></p>\n\n<p><code>Code</code></p>\n\n<blockquote>"Quote"</blockquote>\n\n<h1>H1</h1>\n\n<h2>H2</h2>\n\n<h3>H3</h3>\n\n<ul>\n<li>Bullet</li>\n</ul>\n\n<ol>\n<li>Ordered</li>\n\n<li>Ordered</li>\n</ol>',
      publishedAt: new Date(),
    },
  });
  await strapi.entityService.create("api::post.post", {
    data: {
      title: "Lorem Post 1",
      author: { connect: [userIds[0]] },
      tags: { connect: [tagIds[0], tagIds[1], tagIds[3]] },
      body: faker.lorem.paragraphs(5, "<br/>\n"),
      publishedAt: new Date(),
    },
  });
  await strapi.entityService.create("api::post.post", {
    data: {
      title: "Lorem Post 2",
      author: { connect: [userIds[1]] },
      tags: { connect: tagIds.slice(1, 3) },
      body: faker.lorem.paragraphs(5, "<br/>\n"),
      publishedAt: new Date(),
    },
  });
  await strapi.entityService.create("api::post.post", {
    data: {
      title: "Unpublished Lorem Post",
      author: { connect: [userIds[1]] },
      tags: { connect: tagIds.slice(1, 3) },
      body: faker.lorem.paragraphs(5, "<br/>\n"),
    },
  });
  await strapi.entityService.create("api::post.post", {
    data: {
      title: "Internal post",
      author: { connect: [userIds[1]] },
      tags: { connect: [internalTagId] },
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
            email: "contributor@user.com",
          },
          {
            email: "editor@user.com",
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

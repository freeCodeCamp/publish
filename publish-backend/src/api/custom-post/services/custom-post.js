const { createCoreService } = require("@strapi/strapi").factories;

// function to rename Strapi's default object keys
const renamePostKeys = (postObj) => {
  const { createdAt, updatedAt, publishedAt, ...rest } = postObj;
  return {
    ...rest,
    created_at: createdAt,
    updated_at: updatedAt,
    published_at: publishedAt,
  };
}

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
  async find(...args) {
    const posts = await strapi.entityService.findMany("api::post.post", {
      publicationState: "live", // only published posts
      sort: { publishedAt: "desc" },
    });

    // rename object keys
    const renamedPosts = posts.map((post) => renamePostKeys(post));

    // format data into desired structure
    const response = { posts: renamedPosts };
    return response;
  },

  async findOne(id, ...args) {
    const post = await strapi.entityService.findOne("api::post.post", id, {
      publicationState: "live", // only published posts
    });

    // rename object keys
    const renamedPost = renamePostKeys(post);

    // format data into desired structure
    const response = { posts: [renamedPost] };
    return response;
  },

  async findOneBySlug(slug, ...args) {
    console.log(slug);
    const posts = await strapi.entityService.findMany("api::post.post", {
      filters: {
        slug: slug,
      },
      publicationState: "live", // only published posts
    });

    // rename object keys
    const renamedPosts = posts.map((post) => renamePostKeys(post));

    // format data into desired structure
    const response = { posts: renamedPosts };
    return response;
  },
}));

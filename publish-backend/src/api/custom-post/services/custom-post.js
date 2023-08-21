const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
  async find(...args) {
    const posts = await strapi.entityService.findMany("api::post.post", {
      publicationState: "live", // only published posts
      sort: { publishedAt: "desc" },
    });

    // rename object keys
    const renamedPosts = posts.map(
      ({ createdAt, updatedAt, publishedAt, ...rest }) => ({
        ...rest,
        created_at: createdAt,
        updated_at: updatedAt,
        published_at: publishedAt,
      })
    );

    // format data into desired structure
    const response = { posts: renamedPosts };
    return response;
  },
}));

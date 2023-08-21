"use strict";

/**
 * A set of functions called "actions" for `custom-post`
 */

// Allow query parameter to be "authors" to comply with the old API
// and convert it to "author" to use for populate option
const authorsToAuthor = (populate) => {
  const index = populate.indexOf("authors");
  if (index !== -1) {
    populate[index] = "author";
  }
  return populate;
};

// Sanitize the query parameter to only allow "authors" and "tags"
const sanitizePopulate = (includeQuery) => {
  const expectedValues = ["authors", "tags"];
  const input = includeQuery?.split(",") || [];

  // Filter out unexpected values and remove duplicates
  const filtered = [...new Set(input.filter((item) => expectedValues.includes(item)))];
  return authorsToAuthor(filtered);
}

module.exports = {
  find: async (ctx, next) => {
    try {
      const populate = sanitizePopulate(ctx.request.query.include);
      const response = await strapi
        .service("api::custom-post.custom-post")
        .find(populate);
      ctx.body = response;
    } catch (err) {
      ctx.body = err;
    }
  },
  findOne: async (ctx, next) => {
    try {
      const populate = sanitizePopulate(ctx.request.query.include);
      const response = await strapi
        .service("api::custom-post.custom-post")
        .findOne(ctx.request.params.id, populate);
      ctx.body = response;
    } catch (err) {
      ctx.body = err;
    }
  },
  findOneBySlug: async (ctx, next) => {
    try {
      const populate = sanitizePopulate(ctx.request.query.include);
      const response = await strapi
        .service("api::custom-post.custom-post")
        .findOneBySlug(ctx.request.params.slug, populate);
      ctx.body = response;
    } catch (err) {
      ctx.body = err;
    }
  },
};

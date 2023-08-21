"use strict";

/**
 * A set of functions called "actions" for `custom-post`
 */

module.exports = {
  find: async (ctx, next) => {
    try {
      const response = await strapi
        .service("api::custom-post.custom-post")
        .find();
      ctx.body = response;
    } catch (err) {
      ctx.body = err;
    }
  },
  findOne: async (ctx, next) => {
    try {
      const response = await strapi
        .service("api::custom-post.custom-post")
        .findOne(ctx.request.params.id);
      ctx.body = response;
    } catch (err) {
      ctx.body = err;
    }
  },
  findOneBySlug: async (ctx, next) => {
    try {
      const response = await strapi
        .service("api::custom-post.custom-post")
        .findOneBySlug(ctx.request.params.slug);
      ctx.body = response;
    } catch (err) {
      ctx.body = err;
    }
  },
};

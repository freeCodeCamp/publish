"use strict";

/**
 * A set of functions called "actions" for `post`
 */

module.exports = {
  schedule: async (ctx, next) => {
    try {
      const response = await strapi
        .service("api::post.post")
        .schedule(ctx.request.params.id, ctx.request.body);
      ctx.body = response;
    } catch (err) {
      ctx.body = err;
    }
  },
  publish: async (ctx, next) => {
    try {
      const response = await strapi
        .service("api::post.post")
        .publish(ctx.request.params.id);
      ctx.body = response;
    } catch (err) {
      ctx.body = err;
    }
  },
};

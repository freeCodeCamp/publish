"use strict";

/**
 * A set of functions called "actions" for `custom-post`
 */

module.exports = {
  exampleAction: async (ctx, next) => {
    try {
      ctx.body = "ok";
    } catch (err) {
      ctx.body = err;
    }
  },
  find: async (ctx, next) => {
    try {
      const posts = await strapi.entityService.findMany("api::post.post", {
        fields: ["title", "body"],
      });

      ctx.body = posts;
    } catch (err) {
      ctx.body = err;
    }
  },
};

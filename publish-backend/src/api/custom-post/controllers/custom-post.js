"use strict";

/**
 * A set of functions called "actions" for `custom-post`
 */

module.exports = {
  find: async (ctx, next) => {
    try {
      const response = await strapi.service("api::custom-post.custom-post").find();
      ctx.body = response;
    } catch (err) {
      ctx.body = err;
    }
  },
};

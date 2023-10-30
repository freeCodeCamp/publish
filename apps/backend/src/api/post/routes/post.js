"use strict";

/**
 * post router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::post.post", {
  config: {
    findOne: {
      policies: ["is-own-post"],
    },
    update: {
      policies: ["is-own-post"],
    },
    delete: {
      policies: ["is-own-post"],
    },
  },
});

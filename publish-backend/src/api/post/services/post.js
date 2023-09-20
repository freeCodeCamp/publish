'use strict';

/**
 * post service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
  async create(reqBody = {}) {
    // Prevent updating these fields through this endpoint
    delete reqBody.data.publishedAt;
    delete reqBody.data.scheduled_at;

    return strapi.entityService.create("api::post.post", reqBody);
  },

  async update(postId, reqBody = {}) {
    // Prevent updating these fields through this endpoint
    delete reqBody.data.publishedAt;
    delete reqBody.data.scheduled_at;

    return strapi.entityService.update("api::post.post", postId, reqBody);
  },

  async schedule(postId, reqBody = {}) {
    // Extract the scheduled_at field from the reqBody object
    const { scheduled_at } = reqBody.data;
    // update only the scheduled_at field
    return strapi.entityService.update("api::post.post", postId, {
      data: { scheduled_at },
    });
  },

  async publish(postId) {
    // update only the publishedAt field
    return strapi.entityService.update("api::post.post", postId, {
      data: { publishedAt: new Date() },
    });
  },

  async unpublish(postId) {
    // update only the publishedAt field
    return strapi.entityService.update("api::post.post", postId, {
      data: { publishedAt: null },
    });
  },
}));

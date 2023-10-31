"use strict";

const { ValidationError } = require("@strapi/utils").errors;

/**
 * post service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
  async create(reqBody = {}) {
    if (process.env.DATA_MIGRATION === "true") {
      reqBody.data.createdAt = reqBody.data.created_at;
      reqBody.data.updatedAt = reqBody.data.updated_at;
      delete reqBody.data.created_at;
      delete reqBody.data.updated_at;
    }
    return strapi.entityService.create("api::post.post", reqBody);
  },

  async update(postId, reqBody = {}) {
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

  validatePublishedAt(publishedAt) {
    if (publishedAt > new Date()) {
      throw new ValidationError("publishedAt must be a past date");
    }
    return true;
  },
}));

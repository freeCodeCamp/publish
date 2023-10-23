'use strict';

const { ValidationError } = require("@strapi/utils").errors;
const { customAlphabet } = require("nanoid");

/**
 * post service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
  // finds id from slug_id
  // returns null if not found
  async findIdBySlugId(slug_id) {
    // Have to use findMany instead of fineOne to search by slug_id
    const postIds = await strapi.entityService.findMany("api::post.post", {
      filters: { slug_id: slug_id },
      fields: ["id"],
    });
    return postIds.length > 0 ? postIds[0].id : null;
  },

  async create(reqBody = {}) {
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

  generateSlugId() {
    // generate random 8 characters ID
    const characterSet = "0123456789abcdefghijklmnopqrstuvwxyz";
    const nanoid = customAlphabet(characterSet, 8);
    return nanoid();
  },
}));

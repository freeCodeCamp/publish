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
    // It's okay to update custom_published_at field
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
    // publishedAt is the field used by Strapi to determine if a post is published or draft
    // custom_published_at is the field for the publish date to be displayed to users

    const currentPost = strapi.entityService.findOne("api::post.post", postId);
    const publishDate = new Date();

    if (currentPost.publishedAt === null && currentPost.custom_published_at === null) {
        // Set both publishedAt and custom_published_at to the same date
        return strapi.entityService.update("api::post.post", postId, {
          data: {
            publishedAt: publishDate,
            custom_published_at: publishDate
          },
        });
      } else {
        // Set publishedAt, don't change custom_published_at
        return strapi.entityService.update("api::post.post", postId, {
          data: { publishedAt: publishDate },
        });
      }
    },
}));

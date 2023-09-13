'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
  async schedule(ctx) {
    try {
      const response = await strapi
        .service("api::post.post")
        .schedule(ctx.request.params.id, ctx.request.body);

      // this.transformResponse in controller transforms the response object
      // into { data: { id: 1, attributes: {...} } } format
      // to comply with other default endpoints
      ctx.body = this.transformResponse(response);
    } catch (err) {
      ctx.body = err;
    }
  },
  async publish(ctx) {
    try {
      const response = await strapi
        .service("api::post.post")
        .publish(ctx.request.params.id);
      ctx.body = this.transformResponse(response);
    } catch (err) {
      ctx.body = err;
    }
  },
}));

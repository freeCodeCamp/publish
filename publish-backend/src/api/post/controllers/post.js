'use strict';

/**
 * post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const isEditor = (ctx) => {
  return ctx.state.user.role.name === "Editor";
};


module.exports = createCoreController("api::post.post", ({ strapi }) => ({
  async create(ctx) {
    if (!isEditor(ctx)) {
      // don't allow publishing or scheduling posts
      delete ctx.request.body.data.publishedAt;
      delete ctx.request.body.data.scheduled_at;
    }

    // call the default core action with modified data
    return await super.create(ctx);
  },
  async update(ctx) {
    if (!isEditor(ctx)) {
      // don't allow publishing or scheduling posts
      delete ctx.request.body.data.publishedAt;
      delete ctx.request.body.data.scheduled_at;
    }

    // prevent updating the unique ID
    delete ctx.request.body.data.unique_id;

    // call the default core action with modified data
    return await super.update(ctx);
  },
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
  async unpublish(ctx) {
    try {
      const response = await strapi
        .service("api::post.post")
        .unpublish(ctx.request.params.id);
      ctx.body = this.transformResponse(response);
    } catch (err) {
      ctx.body = err;
    }
  },
}));

"use strict";

/**
 * post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::post.post", ({ strapi }) => {
  const helpers = strapi.service("api::helpers.helpers");

  return {
    async create(ctx) {
      if (!helpers.isEditor(ctx)) {
        // don't allow publishing or scheduling posts
        delete ctx.request.body.data.publishedAt;
        delete ctx.request.body.data.scheduled_at;

        // don't allow code injection
        delete ctx.request.body.data.codeinjection_head;
        delete ctx.request.body.data.codeinjection_foot;

        // force set author to current user
        delete ctx.request.body.data.author;
        ctx.request.body.data.author = [ctx.state.user.id];
      }

      // call the default core action with modified data
      return await super.create(ctx);
    },
    async update(ctx) {
      if (!helpers.isEditor(ctx)) {
        // don't allow publishing or scheduling posts
        delete ctx.request.body.data.publishedAt;
        delete ctx.request.body.data.scheduled_at;

        // don't allow code injection
        delete ctx.request.body.data.codeinjection_head;
        delete ctx.request.body.data.codeinjection_foot;

        // don't allow changing author
        delete ctx.request.body.data.author;
      }

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
    async checkAndPublish(ctx) {
      try {
        const draftPostToPublish = await strapi.entityService.findMany(
          "api::post.post",
          {
            filters: {
              publishedAt: {
                $null: true,
              },
              scheduled_at: {
                $lt: new Date(),
              },
            },
          },
        );

        await Promise.all(
          draftPostToPublish.map((post) => {
            return strapi.service("api::post.post").publish(post.id);
          }),
        );

        const response = {
          count: draftPostToPublish.length,
          data: draftPostToPublish.map((post) => post.title),
        };

        ctx.body = this.transformResponse(response);
      } catch (err) {
        ctx.body = err;
      }
    },
  };
});

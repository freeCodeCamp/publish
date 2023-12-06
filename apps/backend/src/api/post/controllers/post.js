"use strict";
const { ValidationError } = require("@strapi/utils").errors;

/**
 * post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::post.post", ({ strapi }) => {
  const helpers = strapi.service("api::helpers.helpers");

  return {
    async find(ctx) {
      if (helpers.isEditor(ctx) || helpers.isAPIToken(ctx)) {
        // allow access to all posts
        return await super.find(ctx);
      } else {
        // return only current user's posts
        const filters = ctx.query.filters || {};
        if (filters.author) {
          delete filters.author;
        }
        filters.author = [ctx.state.user.id];
        ctx.query.filters = filters;
        // call the default core action with modified ctx
        return await super.find(ctx);
      }
    },
    async findOneBySlugId(ctx) {
      try {
        // find id from slug_id
        const postId = await strapi
          .service("api::post.post")
          .findIdBySlugId(ctx.request.params.slug_id);

        ctx.request.params.id = postId;

        // pass it onto default findOne controller
        return await super.findOne(ctx);
      } catch (err) {
        console.error(err);
        ctx.body = err;
      }
    },
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
      try {
        return await super.create(ctx);
      } catch (err) {
        console.error(err);
        // TODO: DRY out error handling.
        const isValidationError = err instanceof ValidationError;
        if (isValidationError) {
          ctx.throw(400, err);
        } else {
          ctx.throw(err);
        }
      }
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

      // prevent updating the slug ID
      delete ctx.request.body.data.slug_id;

      // call the default core action with modified data
      try {
        return await super.update(ctx);
      } catch (err) {
        console.error(err);
        // TODO: DRY out error handling.
        const isValidationError = err instanceof ValidationError;
        if (isValidationError) {
          ctx.throw(400, err);
        } else {
          ctx.throw(err);
        }
      }
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
        console.error(err);
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
        console.error(err);
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
        console.error(err);
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
        console.error(err);
        ctx.body = err;
      }
    },
  };
});

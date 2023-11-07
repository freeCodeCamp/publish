"use strict";

/**
 * `is-own-post-slug-id` policy
 */

module.exports = async (policyContext, config, { strapi }) => {
  const helpers = strapi.service("api::helpers.helpers");

  // Editors can access any posts
  if (helpers.isEditor(policyContext)) {
    return true;
  }

  // Contributors can only access their own posts
  try {
    // find author id from slug_id
    const posts = await strapi.entityService.findMany("api::post.post", {
      filters: { slug_id: policyContext.params.slug_id },
      fields: ["id"],
      populate: ["author"],
    });

    if (posts[0].author.id !== policyContext.state.user.id) {
      return false;
    }
  } catch (err) {
    strapi.log.error("Error in is-own-post-slug-id policy.");
    strapi.log.error(err);
    return false;
  }

  return true;
};

"use strict";

/**
 * `is-own-post` policy
 */

module.exports = async (policyContext, config, { strapi }) => {
  const helpers = strapi.service("api::helpers.helpers");

  // Editors can access any posts
  if (helpers.isEditor(policyContext)) {
    return true;
  }

  // Contributors can only access their own posts
  try {
    const post = await strapi.entityService.findOne(
      "api::post.post",
      policyContext.params.id,
      {
        populate: ["author"],
      },
    );
    if (post.author.id !== policyContext.state.user.id) {
      return false;
    }
  } catch (err) {
    strapi.log.error("Error in is-own-post policy.");
    strapi.log.error(err);
    return false;
  }

  return true;
};

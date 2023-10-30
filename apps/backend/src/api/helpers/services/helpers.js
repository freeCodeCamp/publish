"use strict";

/**
 * helpers service
 */

module.exports = () => ({
  isEditor(ctx) {
    if (process.env.DATA_MIGRATION === "true") {
      return true;
    }
    return ctx.state?.user?.role?.name === "Editor";
  },
  isAPIToken(ctx) {
    // Checks if the current request is using an API Token instead of users-permissions login
    return ctx.state?.auth?.strategy?.name === "api-token";
  },
});

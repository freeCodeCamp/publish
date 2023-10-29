"use strict";

/**
 * helpers service
 */

module.exports = () => ({
  isEditor(ctx) {
    if (process.env.DATA_MIGRATION === "true") {
      return true;
    }
    return ctx.state.user.role.name === "Editor";
  },
});

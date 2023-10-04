module.exports = (plugin) => {
  plugin.controllers.user.updateMe = async (ctx) => {
    if (!ctx.state.user || !ctx.state.user.id) {
      return (ctx.response.status = 401);
    }

    await strapi
      .query("plugin::users-permissions.user")
      .update({
        where: { id: ctx.state.user.id },
        data: ctx.request.body,
      })
      .then(() => {
        ctx.response.status = 200;
        ctx.response.body = {
          status: "success",
        };
      })
      .catch((err) => {
        ctx.response.status = 400;
        ctx.response.body = {
          status: "error",
          message: err.message,
        };
      });
  };

  plugin.routes["content-api"].routes.unshift({
    method: "PUT",
    path: "/users/me",
    handler: "user.updateMe",
    config: {
      prefix: "",
      policies: [],
    },
  });

  return plugin;
};

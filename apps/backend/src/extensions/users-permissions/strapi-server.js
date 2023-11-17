const DASHBOARD_URL = process.env.DASHBOARD_URL ?? "http://localhost:3000";

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

  // TODO: find out if unshift is necessary or push will work.
  plugin.routes["content-api"].routes.unshift({
    method: "PUT",
    path: "/users/me",
    handler: "user.updateMe",
    config: {
      prefix: "",
      policies: [],
    },
  });

  plugin.controllers.auth.invitation = async (ctx) => {
    if (!ctx.state.user || !ctx.state.user.id) {
      return (ctx.response.status = 401);
    }

    const { email } = await strapi
      .query("plugin::users-permissions.user")
      .update({
        where: { id: ctx.request.params.id },
        data: {
          provider: "auth0",
        },
      });

    await strapi.plugins.email.services.email.send({
      to: email,
      from: "support@freecodecamp.org",
      subject: "Invitation Link",
      text: `Here is your invitation link: ${DASHBOARD_URL}/api/auth/signin`,
    });

    ctx.response.status = 200;
    ctx.response.body = {
      status: "success",
    };
  };
  plugin.routes["content-api"].routes.unshift({
    method: "PUT",
    path: "/auth/invitation/:id",
    handler: "auth.invitation",
    config: {
      prefix: "",
      policies: [],
    },
  });
  return plugin;
};

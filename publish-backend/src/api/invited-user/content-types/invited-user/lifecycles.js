"use strict";

module.exports = {
  async afterCreate(event) {
    await strapi.plugins.email.services.email.send({
      to: event.result.email,
      from: "support@freecodecamp.org",
      subject: "Invitation Link",
      text: `Here is your invitation link: ${process.env.DASHBOARD_URL}/api/auth/signin`,
    });
  },
};

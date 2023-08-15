"use strict";

const { nanoid } = require("nanoid");

module.exports = {
  async beforeCreate(event) {
    event.params.data.token = nanoid();
    await strapi.plugins.email.services.email.send({
      to: event.params.data.email,
      from: "support@freecodecamp.org",
      subject: "Invitation Link",
      text: `Here is your invitation link: ${process.env.DASHBOARD_URL}/auth/signup?token=${event.params.data.token}`,
    });
  },
};

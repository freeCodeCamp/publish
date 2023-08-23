"use strict";

const { generateSeedData } = require("./seed");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.SEED_DATA === "true"
    ) {
      console.log("Seeding database...");
      await generateSeedData(strapi);
      console.log("Seeding database complete!");
    }

    strapi.db.lifecycles.subscribe({
      models: ["plugin::users-permissions.user"],
      async afterCreate(event) {
        const { email } = event.result;
        await strapi.db.query("api::invited-user.invited-user").update({
          where: {
            email: {
              $eq: email,
            },
          },
          data: {
            accepted: true,
          },
        });
      },
    });
  },
};

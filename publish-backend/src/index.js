"use strict";

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
      const { generateSeedData } = require("./seed");
      await generateSeedData(strapi);
      console.log("Seeding database complete!");
    }

    strapi.db.lifecycles.subscribe({
      models: ["plugin::users-permissions.user"],
      async beforeCreate(event) {
        const { email } = event.params.data;
        const invitedUser = await strapi.db
          .query("api::invited-user.invited-user")
          .findOne({
            populate: true,
            where: {
              email: {
                $eq: email,
              },
            },
          });
        if (invitedUser) {
          event.params.data.role = invitedUser.role.id;
        }
        if (process.env.DATA_MIGRATION === "true") {
          event.params.data.password = "";
        }
      },
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
      async beforeUpdate(event) {
        const { id } = event.params.where;
        const { email: newEmail } = event.params.data;
        const { email: oldEmail } = await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          id
        );
        event.state = {
          oldEmail,
          newEmail,
        };
      },
      async afterUpdate(event) {
        const { oldEmail, newEmail } = event.state;
        if (oldEmail !== newEmail) {
          await strapi.db.query("api::invited-user.invited-user").update({
            where: {
              email: {
                $eq: oldEmail,
              },
            },
            data: {
              email: newEmail,
            },
          });
        }
      },
      async beforeDelete(event) {
        const { id } = event.params.where;
        const { email } = await strapi.entityService.findOne(
          "plugin::users-permissions.user",
          id
        );
        await strapi.db.query("api::invited-user.invited-user").delete({
          where: {
            email: {
              $eq: email,
            },
          },
        });
      },
    });
  },
};

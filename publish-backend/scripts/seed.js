const strapi = require("@strapi/strapi");
const { generateSeedData } = require("../src/seed");

const seed = async () => {
  const app = await strapi().load();
  if (process.env.NODE_ENV !== "development") {
    console.log("Seeding the database is only allowed in development mode.");
    process.exit(1);
  }
  console.log("Seeding database...");
  // SEEDING_DATA is set to prevent the sending of emails during seeding.
  process.env.SEEDING_DATA = "true";
  await generateSeedData(app);
  console.log("Seeding database complete!");
  process.exit(0);
};

seed();

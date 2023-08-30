const Strapi = require("@strapi/strapi");
const fs = require("fs");

async function setupStrapi() {
  if (typeof strapi === "undefined") {
    await Strapi().load();
    await strapi.server.mount();
  }
}

async function cleanupStrapi() {
  const dbSettings = strapi.config.get("database.connection");

  //close server to release the db-file
  await strapi.server.httpServer.close();

  // close the connection to the database before deletion
  await strapi.db.connection.destroy();

  //delete test database after all tests have completed
  if (dbSettings && dbSettings.connection && dbSettings.connection.filename) {
    const tmpDbFile = dbSettings.connection.filename;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
}

module.exports = { setupStrapi, cleanupStrapi };

// Default config taken from:
// https://github.com/strapi/strapi/blob/main/packages/plugins/documentation/server/config/default-plugin-config.js

module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("NODEMAILER_HOST", "localhost"),
        secure: false,
        port: 1025,
        auth: {
          user: "test",
          pass: "test",
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
    },
  },
});

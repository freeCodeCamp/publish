// Default config taken from:
// https://github.com/strapi/strapi/blob/main/packages/plugins/documentation/server/config/default-plugin-config.js

module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("AWS_SES_HOST"),
        secure: true,
        port: 465,
        auth: {
          user: env("AWS_SES_KEY"),
          pass: env("AWS_SES_SECRET"),
        },
      },
    },
  },
});

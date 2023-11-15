// Default config taken from:
// https://github.com/strapi/strapi/blob/main/packages/plugins/documentation/server/config/default-plugin-config.js

module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "amazon-ses",
      providerOptions: {
        key: env("AWS_SES_KEY"),
        secret: env("AWS_SES_SECRET"),
        amazon: env("AWS_SES_ENDPOINT"),
      },
    },
  },
});

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
      settings: {
        defaultFrom: "team@freecodecamp.org",
      },
    },
  },
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        baseUrl: `https://s3.${env("AWS_REGION")}.amazonaws.com/${env(
          "AWS_BUCKET",
        )}`, // configure how assets' urls will be saved inside Strapi
        s3Options: {
          accessKeyId: env("AWS_ACCESS_KEY_ID"),
          secretAccessKey: env("AWS_ACCESS_SECRET"),
          region: env("AWS_REGION"),
          params: {
            ACL: "public-read",
            Bucket: env("AWS_BUCKET"),
          },
        },
      },
    },
  },
});

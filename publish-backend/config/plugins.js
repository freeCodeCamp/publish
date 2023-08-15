// Default config taken from:
// https://github.com/strapi/strapi/blob/main/packages/plugins/documentation/server/config/default-plugin-config.js

module.exports = {
  documentation: {
    enabled: true,
    config: {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "fCC Publication API",
        description: "",
        termsOfService: null,
        contact: null,
        license: null,
      },
      "x-strapi-config": {
        path: "/documentation",
        plugins: null,
        mutateDocumentation: null,
      },
      servers: [],
      externalDocs: {
        description: "Find out more",
        url: "https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html",
      },
      security: [{ bearerAuth: [] }],
    },
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: "localhost",
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
  passwordless: {
    enabled: true,
  },
};

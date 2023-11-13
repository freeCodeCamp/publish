module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "localhost"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "strapi"),
      user: env("DATABASE_USERNAME", "strapi"),
      password: env("DATABASE_PASSWORD", "password"),
      ssl: env.bool("DATABASE_SSL", false) && {
        key: env("DATABASE_SSL_KEY", undefined),
        cert: env("DATABASE_SSL_CERT", undefined),
        ca: env("DATABASE_SSL_CA", undefined),
        capath: env("DATABASE_SSL_CAPATH", undefined),
        cipher: env("DATABASE_SSL_CIPHER", undefined),
        rejectUnauthorized: env.bool("DATABASE_SSL_REJECT_UNAUTHORIZED", true),
      },
    },
    dialect: "postgres",
  },
});

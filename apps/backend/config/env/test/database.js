module.exports = () => ({
  connection: {
    client: "sqlite",
    connection: {
      filename: ".tmp/test.db",
    },
    useNullAsDefault: true,
    debug: false,
  },
});

module.exports = {
  documentation: {
    enabled: false,
  },
  "config-sync": {
    enabled: true,
    config: {
      syncDir: "config/sync/",
      minify: false,
      soft: false,
      importOnBootstrap: true, // import permission config on running tests
      customTypes: [],
      excludedTypes: [],
      excludedConfig: [],
    },
  },
};

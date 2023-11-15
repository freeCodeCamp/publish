module.exports = () => ({
  upload: {
    config: {
      provider: "local",
      providerOptions: {
        sizeLimit: 100000,
      },
    },
  },
});

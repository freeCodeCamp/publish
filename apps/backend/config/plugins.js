module.exports = () => ({
  upload: {
    config: {
      provider: "local",
      providerOptions: {
        // 250MB
        sizeLimit: 250000000,
      },
    },
  },
});

module.exports = () => ({
  upload: {
    config: {
      provider: "local",
      // 250MB
      sizeLimit: 250 * 1024 * 1024,
    },
  },
});

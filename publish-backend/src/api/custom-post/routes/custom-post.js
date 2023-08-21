module.exports = {
  routes: [
    {
      method: "GET",
      path: "/content/posts",
      handler: "custom-post.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

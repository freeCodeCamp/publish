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
    {
      method: "GET",
      path: "/content/posts/:id",
      handler: "custom-post.findOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/content/posts/slug/:slug",
      handler: "custom-post.findOneBySlug",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

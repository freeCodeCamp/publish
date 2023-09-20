module.exports = {
  routes: [
    {
      method: "PATCH",
      path: "/posts/:id/schedule",
      handler: "post.schedule",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PATCH",
      path: "/posts/:id/publish",
      handler: "post.publish",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PATCH",
      path: "/posts/:id/unpublish",
      handler: "post.unpublish",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

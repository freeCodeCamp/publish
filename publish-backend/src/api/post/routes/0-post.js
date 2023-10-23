module.exports = {
  routes: [
    {
      method: "GET",
      path: "/posts/uid/:slug_id",
      handler: "post.findOneByUniqueId",
      config: {
        policies: [],
        middlewares: [],
      },
    },
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

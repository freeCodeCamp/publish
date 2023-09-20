module.exports = {
  routes: [
    {
      // schedule a post for publishing
      method: "PATCH",
      path: "/posts/:id/schedule",
      handler: "post.schedule",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      // publish a post immediately
      method: "PATCH",
      path: "/posts/:id/publish",
      handler: "post.publish",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

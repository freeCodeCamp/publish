module.exports = {
  routes: [
    {
      method: "PATCH",
      path: "/posts/:id/schedule",
      handler: "0-post.schedule",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PATCH",
      path: "/posts/:id/publish",
      handler: "0-post.publish",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

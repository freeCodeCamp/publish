module.exports = {
  beforeCreate(event) {
    const {
      params: { data },
    } = event;
    if (data.publishedAt) {
      strapi
        .service("api::post.post")
        .validatePublishedAt(new Date(data.publishedAt));
    }
    data.slug_id = strapi.service("api::post.post").generateUniqueId();
  },
  beforeUpdate(event) {
    const {
      params: { data },
    } = event;
    if (data.publishedAt) {
      strapi
        .service("api::post.post")
        .validatePublishedAt(new Date(data.publishedAt));
    }
  },
};

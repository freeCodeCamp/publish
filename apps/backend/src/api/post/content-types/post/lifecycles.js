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
    // auto generate slug_id
    data.slug_id = strapi.service("api::post.post").generateSlugId();
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

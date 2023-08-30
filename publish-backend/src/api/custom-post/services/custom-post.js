const { createCoreService } = require("@strapi/strapi").factories;

// format data structure to match the old API
// and remove attributes we don't want to include in the response
const formatAuthor = (authorObj = {}) => {
  const {
    createdAt,
    updatedAt,
    // Exclude the attributes below from the response
    username,
    email,
    provider,
    password,
    resetPasswordToken,
    confirmationToken,
    confirmed,
    blocked,
    // Exclude the attributes above from the response
    ...rest
  } = authorObj;

  return {
    ...rest,
    created_at: createdAt,
    updated_at: updatedAt,
  };
};

// format data structure to match the old API
const formatTag = (tagObj = {}) => {
  const { createdAt, updatedAt, ...rest } = tagObj;

  return {
    ...rest,
    created_at: createdAt,
    updated_at: updatedAt,
  };
};

// format data structure to match the old API
const formatPost = (postObj) => {
  const { createdAt, updatedAt, publishedAt, author, tags, ...rest } = postObj;

  let formattedPost = {
    ...rest,
    created_at: createdAt,
    updated_at: updatedAt,
    published_at: publishedAt,
  };

  if (author) {
    const formattedAuthor = formatAuthor(author);
    // Note: with current model relation, there is only 1 author for a post
    // but to comply with the format of the old API we are putting it in an array
    formattedPost.authors = [formattedAuthor];
  }

  if (tags) {
    const formattedTags = tags.map((tag) => formatTag(tag));
    formattedPost.tags = formattedTags;
  }

  return formattedPost;
};

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
  async find(populate = []) {
    const posts = await strapi.entityService.findMany("api::post.post", {
      publicationState: "live", // only published posts
      sort: { publishedAt: "desc" },
      populate: populate,
    });

    // rename object keys
    const formattedPosts = posts.map((post) => formatPost(post));

    // format data into desired structure
    const response = { posts: formattedPosts };
    return response;
  },

  async findOne(id, populate = []) {
    const post = await strapi.entityService.findOne("api::post.post", id, {
      publicationState: "live", // only published posts
      populate: populate,
    });

    // rename object keys
    const formattedPost = formatPost(post);

    // format data into desired structure
    const response = { posts: [formattedPost] };
    return response;
  },

  async findOneBySlug(slug, populate = []) {
    console.log(slug);
    const posts = await strapi.entityService.findMany("api::post.post", {
      publicationState: "live", // only published posts
      filters: {
        slug: slug,
      },
      populate: populate,
    });

    // rename object keys
    const formattedPosts = posts.map((post) => formatPost(post));

    // format data into desired structure
    const response = { posts: formattedPosts };
    return response;
  },
}));

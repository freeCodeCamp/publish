const request = require("supertest");

const expectedPost = {
  id: 1,
  title: "Test Title",
  slug: "test-slug",
  body: "<p>test body</p>",
  excerpt: null,
  locale: "en",
  published_at: "2023-08-30T00:00:00.000Z",
  created_at: expect.any(String),
  updated_at: expect.any(String),
};

const expectedAuthor = {
  slug: "test-user",
  name: "Test User",
  bio: null,
  website: null,
  location: null,
  facebook: null,
  twitter: null,
  status: "active",
  last_seen: null,
  created_at: expect.any(String),
  updated_at: expect.any(String),
};

// Author properties that should not be in the API response
const hiddenAuthorKeys = [
  "username",
  "email",
  "provider",
  "password",
  "resetPasswordToken",
  "confirmationToken",
  "confirmed",
  "blocked",
];

const expectedTag = {
  slug: "html",
  name: "HTML",
  visibility: "public",
  created_at: expect.any(String),
  updated_at: expect.any(String),
};

const findPostByTitle = (posts, title) => {
  return posts.find((post) => post.title === title);
};

describe("custom-post", () => {
  describe("GET /content/posts", () => {
    it("should return posts", async () => {
      const response = await request(strapi.server.httpServer).get(
        "/api/content/posts"
      );

      // Should return all posts
      expect(response.status).toBe(200);
      expect(response.body.posts.length).toBe(2);

      // Check post data structure
      const responsePost = findPostByTitle(
        response.body.posts,
        expectedPost.title
      );
      expect(responsePost).toEqual(expect.objectContaining(expectedPost));

      // Should not include authors and tags
      expect(responsePost).not.toHaveProperty("authors");
      expect(responsePost).not.toHaveProperty("tags");
    });

    it("should return posts with author and tags", async () => {
      const response = await request(strapi.server.httpServer).get(
        "/api/content/posts?include=authors,tags"
      );

      // Should return all posts
      expect(response.status).toBe(200);
      expect(response.body.posts.length).toBe(2);

      // Check post data structure
      const responsePost = findPostByTitle(
        response.body.posts,
        expectedPost.title
      );
      expect(responsePost).toEqual(expect.objectContaining(expectedPost));

      // Check author and tag data structure
      expect(responsePost.authors[0]).toEqual(
        expect.objectContaining(expectedAuthor)
      );
      expect(responsePost.authors[0]).not.toHaveProperty(hiddenAuthorKeys);
      expect(responsePost.tags[0]).toEqual(
        expect.objectContaining(expectedTag)
      );
    });
  });

  describe("GET /content/posts/:id", () => {
    it("should return post", async () => {
      const response = await request(strapi.server.httpServer).get(
        `/api/content/posts/${expectedPost.id}`
      );

      // Should return one single post
      expect(response.status).toBe(200);
      expect(response.body.posts.length).toBe(1);

      // Check post data structure
      const responsePost = response.body.posts[0];
      expect(responsePost).toEqual(expect.objectContaining(expectedPost));

      // Should not include authors and tags
      expect(responsePost).not.toHaveProperty("authors");
      expect(responsePost).not.toHaveProperty("tags");
    });

    it("should return post with authors and tags", async () => {
      const response = await request(strapi.server.httpServer).get(
        `/api/content/posts/${expectedPost.id}?include=authors,tags`
      );

      // Should return one single post
      expect(response.status).toBe(200);
      expect(response.body.posts.length).toBe(1);

      // Check post data structure
      const responsePost = response.body.posts[0];
      expect(responsePost).toEqual(expect.objectContaining(expectedPost));

      // Check author and tag data structure
      expect(responsePost.authors[0]).toEqual(
        expect.objectContaining(expectedAuthor)
      );
      expect(responsePost.authors[0]).not.toHaveProperty(hiddenAuthorKeys);
      expect(responsePost.tags[0]).toEqual(
        expect.objectContaining(expectedTag)
      );
    });
  });

  describe("GET /content/posts/slug/:slug", () => {
    it("should return post", async () => {
      const response = await request(strapi.server.httpServer).get(
        `/api/content/posts/slug/${expectedPost.slug}`
      );

      // Should return one single post
      expect(response.status).toBe(200);
      expect(response.body.posts.length).toBe(1);

      // Check post data structure
      const responsePost = response.body.posts[0];
      expect(responsePost).toEqual(expect.objectContaining(expectedPost));

      // Should not include authors and tags
      expect(responsePost).not.toHaveProperty("authors");
      expect(responsePost).not.toHaveProperty("tags");
    });

    it("should return post with authors and tags", async () => {
      const response = await request(strapi.server.httpServer).get(
        `/api/content/posts/slug/${expectedPost.slug}?include=authors,tags`
      );

      // Should return one single post
      expect(response.status).toBe(200);
      expect(response.body.posts.length).toBe(1);

      // Check post data structure
      const responsePost = response.body.posts[0];
      expect(responsePost).toEqual(expect.objectContaining(expectedPost));

      // Check author and tag data structure
      expect(responsePost.authors[0]).toEqual(
        expect.objectContaining(expectedAuthor)
      );
      expect(responsePost.authors[0]).not.toHaveProperty(hiddenAuthorKeys);
      expect(responsePost.tags[0]).toEqual(
        expect.objectContaining(expectedTag)
      );
    });
  });
});

const request = require("supertest");
const { getUser, getPost, getUserJWT } = require("../helpers/helpers");

let contributorJWT = "";
let editorJWT = "";
let postToCreate;

beforeAll(async () => {
  // Prepare user token
  const contributorUser = await getUser("contributor-user");
  contributorJWT = await getUserJWT("contributor-user");
  editorJWT = await getUserJWT("editor-user");

  // Prepare post to create
  postToCreate = {
    data: {
      title: "New Post",
      body: "<p>test body</p>",
      slug: "new-post",
      publishedAt: new Date("2023-08-30T00:00:00.000Z"),
      publish_at: new Date("2023-08-30T00:00:00.000Z"),
      author: {
        connect: [contributorUser.id],
      },
    },
  };
});

afterEach(async () => {
  jest.setTimeout(1000);
});

describe("post", () => {
  describe("POST /posts", () => {
    it("should create post excluding publishedAt and publish_at", async () => {
      const response = await request(strapi.server.httpServer)
        .post("/api/posts")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send(JSON.stringify(postToCreate));

      console.log("contributorJWT: " + contributorJWT);
      console.log(JSON.stringify(response.body));

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      // Should not set publishedAt and publish_at through this endpoint
      expect(responsePost.publishedAt).toBeNull();
      expect(responsePost.publish_at).toBeNull();
    });
  });
  describe("PUT /posts/:id", () => {
    it("should update post excluding publishedAt and publish_at", async () => {
      // find a post to update
      const post = await getPost("test-slug");

      const response = await request(strapi.server.httpServer)
        .put(`/api/posts/${post.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send(
          JSON.stringify({
            data: {
              publishedAt: new Date(),
              publish_at: new Date(),
            },
          })
        );

      console.log(JSON.stringify(response.body));

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      // Should not update publishedAt and publish_at through this endpoint
      expect(responsePost.publishedAt).toEqual(post.publishedAt);
      expect(responsePost.publish_at).toEqual(post.publish_at);
    });
  });
  describe("PATCH /posts/:id/schedule", () => {
    it("should schedule publishing a post", async () => {
      // find a post to update
      const post = await getPost("draft-post");

      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      console.log("editorJWT: " + editorJWT);

      const response = await request(strapi.server.httpServer)
        .patch(`/api/posts/${post.id}/schedule`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${editorJWT}`)
        .send(
          JSON.stringify({
            data: {
              publish_at: oneHourFromNow,
            },
          })
        );

      console.log(JSON.stringify(response.body));

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      // Should set publish_at
      expect(responsePost.publish_at).toEqual(oneHourFromNow.toISOString());
    });
  });
  describe("PATCH /posts/:id/publish", () => {
    it("should publish a post", async () => {
      // find a post to publish
      const post = await getPost("draft-post");

      const response = await request(strapi.server.httpServer)
        .patch(`/api/posts/${post.id}/publish`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${editorJWT}`)
        .send();

      console.log(JSON.stringify(response.body));

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      // Should be published
      expect(responsePost.publishedAt).not.toBeNull();
    });
  });
});

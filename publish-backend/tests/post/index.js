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
      scheduled_at: new Date("2023-08-30T00:00:00.000Z"),
      author: {
        connect: [contributorUser.id],
      },
    },
  };
});

afterEach(async () => {
  // delete the created test post
  try {
    const post = await getPost(postToCreate.data.slug);
    if (post) {
      await strapi.entityService.delete("api::post.post", post.id);
    }
  } catch (e) {
    console.error(e);
  }
});

describe("post", () => {
  describe("POST /posts", () => {
    it("should create post including publishedAt and scheduled_at for editors", async () => {
      const response = await request(strapi.server.httpServer)
        .post("/api/posts")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${editorJWT}`)
        .send(JSON.stringify(postToCreate));

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      expect(responsePost.publishedAt).toEqual(
        postToCreate.data.publishedAt.toISOString()
      );
      expect(responsePost.scheduled_at).toEqual(
        postToCreate.data.publishedAt.toISOString()
      );
    });

    it("should create post excluding publishedAt and scheduled_at for contributors", async () => {
      const response = await request(strapi.server.httpServer)
        .post("/api/posts")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send(JSON.stringify(postToCreate));

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      // Should not set publishedAt and scheduled_at for contributors
      expect(responsePost.publishedAt).toBeNull();
      expect(responsePost.scheduled_at).toBeNull();
    });

    it("should not set publishedAt to future date", async () => {
      const postToCreateCopy = { data: { ...postToCreate.data } };
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      postToCreateCopy.data.publishedAt = oneHourFromNow;

      const response = await request(strapi.server.httpServer)
        .post("/api/posts")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${editorJWT}`)
        .send(JSON.stringify(postToCreateCopy));

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe(
        "publishedAt must be a past date"
      );
    });

    it("should auto generate slug_id", async () => {
      const response = await request(strapi.server.httpServer)
        .post("/api/posts")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send(JSON.stringify(postToCreate));

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      // slug_id should consist of 8 characters from the lowercase letters and numbers
      expect(responsePost.slug_id).toMatch(/^[0-9a-z]{8}$/);
    });
  });
  describe("PUT /posts/:id", () => {
    it("should update post including publishedAt and scheduled_at for editors", async () => {
      // find a post to update
      const post = await getPost("test-slug");
      const newData = {
        data: {
          publishedAt: new Date(),
          scheduled_at: new Date(),
        },
      };

      const response = await request(strapi.server.httpServer)
        .put(`/api/posts/${post.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${editorJWT}`)
        .send(JSON.stringify(newData));

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      expect(responsePost.publishedAt).toEqual(
        newData.data.publishedAt.toISOString()
      );
      expect(responsePost.scheduled_at).toEqual(
        newData.data.scheduled_at.toISOString()
      );
    });

    it("should update post excluding publishedAt and scheduled_at for contributors", async () => {
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
              scheduled_at: new Date(),
            },
          })
        );

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      // Should not update publishedAt and scheduled_at through this endpoint
      expect(responsePost.publishedAt).toEqual(post.publishedAt);
      expect(responsePost.scheduled_at).toEqual(post.scheduled_at);
    });

    it("should not set publishedAt to future date", async () => {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      // find a post to update
      const post = await getPost("test-slug");
      const newData = {
        data: {
          publishedAt: oneHourFromNow,
        },
      };

      const response = await request(strapi.server.httpServer)
        .put(`/api/posts/${post.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${editorJWT}`)
        .send(JSON.stringify(newData));

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe(
        "publishedAt must be a past date"
      );
    });

    it("should not change slug_id", async () => {
      // get slug_id from database
      const post = await getPost("test-slug");
      const postCopy = { data: { ...post.data } };
      postCopy.data.slug_id = "000000";

      const response = await request(strapi.server.httpServer)
        .put(`/api/posts/${post.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send(JSON.stringify(postCopy));

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      expect(responsePost.slug_id).toEqual(post.slug_id);
    });
  });
  describe("GET /posts/uid/:slug_id", () => {
    it("should find post by slug_id", async () => {
      // get slug_id from database
      const post = await getPost("test-slug");

      // find the post by slug_id through API
      const response = await request(strapi.server.httpServer)
        .get(`/api/posts/uid/${post.slug_id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send();

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      expect(responsePost.slug_id).toEqual(post.slug_id);
      expect(responsePost.slug).toEqual("test-slug");
    });
  });
  describe("PATCH /posts/:id/schedule", () => {
    it("should schedule publishing a post", async () => {
      // find a post to update
      const post = await getPost("draft-post");

      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      const response = await request(strapi.server.httpServer)
        .patch(`/api/posts/${post.id}/schedule`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${editorJWT}`)
        .send(
          JSON.stringify({
            data: {
              scheduled_at: oneHourFromNow,
            },
          })
        );

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      // Should set scheduled_at
      expect(responsePost.scheduled_at).toEqual(oneHourFromNow.toISOString());
    });

    it("should prevent contributors scheduling publishing a post", async () => {
      // find a post to update
      const post = await getPost("draft-post");

      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      const response = await request(strapi.server.httpServer)
        .patch(`/api/posts/${post.id}/schedule`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send(
          JSON.stringify({
            data: {
              scheduled_at: oneHourFromNow,
            },
          })
        );

      expect(response.status).toBe(403);
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

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      // Should be published
      expect(responsePost.publishedAt).not.toBeNull();
    });

    it("should prevent contributors publishing a post", async () => {
      // find a post to publish
      const post = await getPost("draft-post");

      const response = await request(strapi.server.httpServer)
        .patch(`/api/posts/${post.id}/publish`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send();

      expect(response.status).toBe(403);
    });
  });
  describe("PATCH /posts/:id/unpublish", () => {
    it("should unpublish a post", async () => {
      // find a post to unpublish
      const post = await getPost("published-post");

      const response = await request(strapi.server.httpServer)
        .patch(`/api/posts/${post.id}/unpublish`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${editorJWT}`)
        .send();

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      // Should be unpublished
      expect(responsePost.publishedAt).toBeNull();
    });

    it("should prevent contributors unpublishing a post", async () => {
      // find a post to unpublish
      const post = await getPost("published-post");

      const response = await request(strapi.server.httpServer)
        .patch(`/api/posts/${post.id}/unpublish`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send();

      expect(response.status).toBe(403);
    });
  });
});

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
  describe("GET /posts", () => {
    it("should return only the current user's posts for contributors", async () => {
      const response = await request(strapi.server.httpServer)
        .get(`/api/posts?populate=author`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send();

      expect(response.status).toBe(200);
      // check that all posts belong to the current user
      const user = await getUser("contributor-user");
      expect(
        response.body.data.every(
          (post) => post.attributes.author.data.id === user.id,
        ),
      ).toBe(true);
    });
  });
  describe("GET /posts/:id", () => {
    it("should prevent contributors viewing other user's post", async () => {
      const post = await getPost("editors-draft-post");

      const response = await request(strapi.server.httpServer)
        .get(`/api/posts/${post.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send();

      expect(response.status).toBe(403);
    });
  });
  describe("GET /posts/slug_id/:slug_id", () => {
    it("should find post by slug_id", async () => {
      // get slug_id from database
      const post = await getPost("test-slug");

      // find the post by slug_id through API
      const response = await request(strapi.server.httpServer)
        .get(`/api/posts/slug_id/${post.slug_id}`)

      const responsePost = response.body.data.attributes;

      expect(responsePost.slug_id).toEqual(post.slug_id);
      expect(responsePost.slug).toEqual("test-slug");
    });
  });
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
        postToCreate.data.publishedAt.toISOString(),
      );
      expect(responsePost.scheduled_at).toEqual(
        postToCreate.data.publishedAt.toISOString(),
      );
    });

    it("should create post excluding restricted fields for contributors", async () => {
      const postToCreateCopy = { ...postToCreate };
      postToCreateCopy.data.codeinjection_head =
        "<script>alert('test')</script>";
      postToCreateCopy.data.codeinjection_foot =
        "<script>alert('test')</script>";

      const response = await request(strapi.server.httpServer)
        .post("/api/posts")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send(JSON.stringify(postToCreateCopy));

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      // Should not set publishedAt and scheduled_at for contributors
      expect(responsePost.publishedAt).toBeNull();
      expect(responsePost.scheduled_at).toBeNull();
      expect(responsePost.codeinjection_head).toBeNull();
      expect(responsePost.codeinjection_foot).toBeNull();
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
        "publishedAt must be a past date",
      );
    });

    it("should prevent contributors creating other user's post", async () => {
      const currentUser = await getUser("contributor-user");

      const postToCreateCopy = { ...postToCreate };
      const editorUser = await getUser("editor-user");
      postToCreateCopy.data.author = [editorUser.id];

      const response = await request(strapi.server.httpServer)
        .post("/api/posts")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send(JSON.stringify(postToCreateCopy));

      expect(response.status).toBe(200);
      // author should be changed to the current user
      const postCreated = await strapi.entityService.findOne(
        "api::post.post",
        response.body.data.id,
        { populate: { author: true } },
      );
      expect(postCreated.author.id).toBe(currentUser.id);
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
        newData.data.publishedAt.toISOString(),
      );
      expect(responsePost.scheduled_at).toEqual(
        newData.data.scheduled_at.toISOString(),
      );
    });

    it("should update post excluding restricted fields for contributors", async () => {
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
              codeinjection_head: "<script>alert('test')</script>",
              codeinjection_foot: "<script>alert('test')</script>",
            },
          }),
        );

      expect(response.status).toBe(200);
      const responsePost = response.body.data.attributes;

      // Should not update restricted fields through this endpoint
      expect(responsePost.publishedAt).toEqual(post.publishedAt);
      expect(responsePost.scheduled_at).toEqual(post.scheduled_at);
      expect(responsePost.codeinjection_head).toEqual(post.codeinjection_head);
      expect(responsePost.codeinjection_foot).toEqual(post.codeinjection_foot);
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
        "publishedAt must be a past date",
      );
    });

    it("should prevent contributors updating other user's post", async () => {
      const post = await getPost("editors-draft-post");
      const newData = {
        data: {
          title: "Updated",
        },
      };

      const response = await request(strapi.server.httpServer)
        .put(`/api/posts/${post.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send(JSON.stringify(newData));

      expect(response.status).toBe(403);
      // title should not be changed
      const postAfterRequest = await strapi.entityService.findOne(
        "api::post.post",
        post.id,
      );
      expect(postAfterRequest.title).toBe(post.title);
    });

    it("should prevent contributors changing author to other user", async () => {
      const post = await getPost("test-slug");
      const editorUser = await getUser("editor-user");
      const contributorUser = await getUser("contributor-user");
      const newData = {
        data: {
          author: [editorUser.id],
        },
      };

      const response = await request(strapi.server.httpServer)
        .put(`/api/posts/${post.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send(JSON.stringify(newData));

      expect(response.status).toBe(200);
      // author should not be changed
      const postAfterRequest = await strapi.entityService.findOne(
        "api::post.post",
        post.id,
        { populate: { author: true } },
      );
      expect(postAfterRequest.author.id).toBe(contributorUser.id);
    });

    it("should allow editors to update other user's post", async () => {
      const post = await getPost("test-slug");
      const newData = {
        data: {
          title: "Updated",
        },
      };

      const response = await request(strapi.server.httpServer)
        .put(`/api/posts/${post.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${editorJWT}`)
        .send(JSON.stringify(newData));

      expect(response.status).toBe(200);
      // title should be changed
      const postAfterRequest = await strapi.entityService.findOne(
        "api::post.post",
        post.id,
      );
      expect(postAfterRequest.title).toBe(newData.data.title);
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
          }),
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
          }),
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
  describe("DELETE /posts/:id", () => {
    it("should prevent contributors deleting other user's post", async () => {
      const post = await getPost("editors-draft-post");

      const response = await request(strapi.server.httpServer)
        .delete(`/api/posts/${post.id}`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${contributorJWT}`)
        .send();

      expect(response.status).toBe(403);
    });
  });
});

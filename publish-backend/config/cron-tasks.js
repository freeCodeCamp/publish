module.exports = {
  /**
   * Scheduled publication workflow.
   * Checks every minute if there are draft posts to publish.
   */

  '*/1 * * * *': async () => {
    // fetch posts to publish;
    const draftPostToPublish = await strapi.entityService.findMany(
      'api::post.post',
      {
        // there is no publicationState option to directly filter only draft posts
        publicationState: 'preview', // 'preview' returns both draft and published posts
        filters: {
          publishedAt: {
            $null: true, // filter posts that have not been published
          },
          scheduled_at: {
            $lt: new Date(), // AND 'scheduled_at' is lower than the current datetime
          },
        },
      }
    );
    // publish the posts fetched above
    await Promise.all(
      draftPostToPublish.map((post) => {
        return strapi.entityService.update('api::post.post', post.id, {
          data: {
            publishedAt: new Date(),
          },
        });
      })
    );
  },
};

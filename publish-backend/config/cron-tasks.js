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
        publicationState: 'preview', // preview returns both draft and published entries
        filters: {
          publishedAt: {
            $null: true, // so we add another condition here to filter entries that have not been published
          },
          publish_at: {
            $lt: new Date(), // and we keep only posts with a 'publish_at' datetime value that is lower than the current datetime
          },
        },
      }
    );
    // update the publish_at of posts previously fetched
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

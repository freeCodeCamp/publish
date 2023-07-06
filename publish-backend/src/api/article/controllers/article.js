'use strict';

/**
 * article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  async find(ctx) {
    // Calling the default core action
    const { data, meta } = await super.find(ctx);
    const query = strapi.db.query('api::article.article');
    await Promise.all(
      data.map(async (item, index) => {
        const foundItem = await query.findOne({
          where: {
            id: item.id,
          },
          populate: ['createdBy', 'updatedBy'],
        });

        data[index].attributes.createdBy = {
          id: foundItem.createdBy?.id,
          firstname: foundItem.createdBy?.firstname,
          lastname: foundItem.createdBy?.lastname,
          username: foundItem.createdBy?.username, // Add author's usernane to the API response, just as a demo
        };
        data[index].attributes.updatedBy = {
          id: foundItem.updatedBy?.id,
          firstname: foundItem.updatedBy?.firstname,
          lastname: foundItem.updatedBy?.lastname,
          username: foundItem.updatedBy?.username,
        };
      })
    );
    return { data, meta };
  },
}));

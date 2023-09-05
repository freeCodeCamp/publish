'use strict';

/**
 * invited-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::invited-user.invited-user');

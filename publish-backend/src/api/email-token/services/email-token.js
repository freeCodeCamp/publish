'use strict';

/**
 * email-token service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::email-token.email-token');

"use strict";
const { sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    try {
      const code = ctx.params.id;
      const coupon = await strapi.services.coupon.findOne({
        code: code.toUpperCase(),
        expire_date_gte: new Date().toISOString().substring(0, 10),
      });

      if (!coupon) {
        return ctx.response.notFound("Invalid coupon");
      }
      if (coupon.applied < coupon.limit) {
        return sanitizeEntity(coupon, {
          model: strapi.models.coupon,
        });
      }
      return ctx.response.notFound("Maximum limit reached");
    } catch (error) {
      console.error(error.message);
      return ctx.response.badImplementation("Internal error");
    }
  },
};

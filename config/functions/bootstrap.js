'use strict'

const data = require('../../data/products')

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

module.exports = async () => {
  const { products } = data
  console.log(`🌱 Inserting Seed Data: ${products.length} Products`)

  products.forEach(async (product) => {
    const { name, description, price, status } = product

    const foundProduct = await strapi.services.product.findOne({ name }, [
      'name',
    ])

    if (foundProduct !== null) {
      console.log(`${name} already exists`)
      return
    }

    strapi.services.product.create({
      name,
      description,
      status,
      price,
    })
  })
}

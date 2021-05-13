const strapiInstance = require('strapi')

const data = require('../data/products')

strapiInstance()
  .load()
  .then(async (strapi) => {
    const { products } = data
    console.log(`🌱 Inserting Seed Data: ${products.length} Products`)

    for (const product of products) {
      const { name, description, price, status } = product

      const foundProduct = await strapi.services.product.findOne({ name }, [
        'name',
      ])

      if (foundProduct !== null) {
        console.log(`  🛍️  Product already exists: ${name}`)
        continue
      }

      strapi.services.product.create({
        name,
        description,
        status,
        price,
      })

      console.log(`  🛍️  Adding Product: ${name}`)
    }
    // exit with 0 code
    strapi.stop(0)
  })

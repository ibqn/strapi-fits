const strapiInstance = require('strapi')

const path = require('path')
const fs = require('fs')
const mime = require('mime-types')

const data = require('../data/products')

strapiInstance()
  .load()
  .then(async (strapi) => {
    const { products } = data
    console.log(`🌱 Inserting Seed Data: ${products.length} Products`)

    let skippedProducts = 0

    for (const productData of products) {
      const { name, description, price, status, image } = productData

      const foundProduct = await strapi.services.product.findOne({ name }, [
        'name',
      ])

      if (foundProduct !== null) {
        console.log(`  🛍️  Product already exists: ${name}`)
        skippedProducts++
        continue
      }

      const imgPath = path.join('data', image)
      const imgBuffer = await fs.statSync(imgPath)
      const imgName = path.basename(imgPath)

      const imageData = {
        path: imgPath,
        name: imgName,
        type: mime.lookup(imgPath),
        size: imgBuffer.size,
      }

      // console.log('image', imageData)

      const productImage = await strapi.services['product-image'].create(
        {
          altText: name,
        },
        {
          files: { image: imageData },
        }
      )
      console.log('product image', productImage)

      console.log(`  🛍️  Adding Product: ${name}`)

      const product = await strapi.services.product.create({
        name,
        description,
        status,
        price,
        images: [productImage],
      })
      console.log('product', product)
    }

    console.log(
      `✅  Seed Data Inserted: ${products.length - skippedProducts} Products`
    )

    strapi.stop(0)
  })

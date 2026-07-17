import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function replaceUnsplash(url: string | null | undefined, placeholder: string): string {
  if (!url || !url.includes('unsplash.com')) return url || ''
  return placeholder
}

function replaceUnsplashInArray(urls: string[] | null | undefined, placeholder: string): string[] {
  if (!urls) return []
  return urls.map(url => replaceUnsplash(url, placeholder))
}

async function main() {
  const updatedRecords: string[] = []

  console.log('Starting image URL fix...\n')

  // --- Collections ---
  const collections = await prisma.collection.findMany()
  for (const c of collections) {
    const newCover = replaceUnsplash(c.coverImage, '/images/placeholder/collection-classic.svg')
    if (newCover !== c.coverImage) {
      await prisma.collection.update({
        where: { id: c.id },
        data: { coverImage: newCover }
      })
      updatedRecords.push(`Collection: ${c.id} (${c.name_en})`)
    }
  }

  // --- Products ---
  const products = await prisma.product.findMany()
  const manualProducts = []
  for (const p of products) {
    const newImages = replaceUnsplashInArray(p.images, '/images/placeholder/product-default.svg')
    const hasChanges = newImages.some((url, i) => url !== p.images[i])
    if (hasChanges) {
      await prisma.product.update({
        where: { id: p.id },
        data: { images: newImages }
      })
      updatedRecords.push(`Product: ${p.id} (${p.name_en})`)
    } else {
      // Track manual images to report later
      manualProducts.push(p)
    }
  }

  // --- BlogPosts ---
  const blogPosts = await prisma.blogPost.findMany()
  for (const b of blogPosts) {
    const newCover = replaceUnsplash(b.coverImage, '/images/placeholder/blog-default.svg')
    if (newCover !== b.coverImage) {
      await prisma.blogPost.update({
        where: { id: b.id },
        data: { coverImage: newCover }
      })
      updatedRecords.push(`BlogPost: ${b.id} (${b.title_en})`)
    }
  }

  // --- Report Findings ---
  if (updatedRecords.length === 0) {
    console.log('No unsplash URLs found - all images already use local placeholders.')
  } else {
    console.log(`\nUpdated ${updatedRecords.length} records with local placeholders:\n`)
    for (const r of updatedRecords) {
      console.log(`  - ${r}`)
    }
  }

  console.log('\nManual product images preserved (non-unsplash paths untouched):')
  manualProducts.forEach(p => {
    console.log(`  - ${p.id} (${p.name_en}): ${p.images.join(', ')}`)
  })

  console.log('\nDone!')
}

main()
  .catch(e => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
require('dotenv').config()
const { Client } = require('pg')
const fs = require('fs')

const DATABASE_URL = process.env.DATABASE_URL

const PRODUCT_IMAGES = {
  'Classic Silver':  '/uploads/550f3103-ba78-4ee6-9aaf-0a452cf1a3cd.png',
  'Classic Black':   '/uploads/079a49ab-4634-46b9-98cb-c5bdd30d13a4.png',
  'Classic Gold':    '/uploads/16f524af-6a33-4989-9238-bdfa60a16efa.png',
  'Classic Ceramic': '/uploads/5ef796bd-3d28-4838-a88d-72011fe3751d.png',
  'Ocean Blue':      '/uploads/19f515f2-8acd-4d65-bf12-99d81bd7f130.png',
  'Ocean Green':     '/uploads/9aaf61b6-2594-4953-8554-4ba45ea40e79.png',
  'Ocean Coral':     '/uploads/869c51ce-304e-4e8b-a40b-960be9c48c0f.png',
  'Ocean Carbon':    '/uploads/c7325686-6788-4fc6-8314-704eb88318b2.png',
  'Night Dark':      '/uploads/b6b60dc7-b9ef-499b-92f1-57f04a2f6e53.png',
  'Night Silver':    '/uploads/b9664d32-bb7e-402c-8ffd-167cec0f818b.png',
  'Night Violet':    '/uploads/b6b60dc7-b9ef-499b-92f1-57f04a2f6e53.png',
  'Night Gold':      '/uploads/b9664d32-bb7e-402c-8ffd-167cec0f818b.png',
}

const COLLECTION_COVERS = {
  'deniz-classic': '/uploads/550f3103-ba78-4ee6-9aaf-0a452cf1a3cd.png',
  'deniz-ocean':   '/uploads/19f515f2-8acd-4d65-bf12-99d81bd7f130.png',
  'deniz-night':   '/uploads/b6b60dc7-b9ef-499b-92f1-57f04a2f6e53.png',
}

async function main() {
  const client = new Client({ connectionString: DATABASE_URL, connectionTimeoutMillis: 30000 })
  await client.connect()
  console.log('Connected to production database.\n')

  // Fix Collections
  console.log('=== COLLECTION COVER IMAGES ===')
  const cols = await client.query('SELECT id, name_en, slug, "coverImage" FROM "Collection"')
  for (const c of cols.rows) {
    const newCover = COLLECTION_COVERS[c.slug]
    if (!newCover) { console.log('  SKIP: ' + c.name_en); continue }
    if (c.coverImage === newCover) { console.log('  OK:   ' + c.name_en); continue }
    await client.query('UPDATE "Collection" SET "coverImage" = $1 WHERE id = $2', [newCover, c.id])
    console.log('  FIXED: ' + c.name_en + '  was: ' + c.coverImage + '  now: ' + newCover)
  }

  // Fix Products
  console.log('\n=== PRODUCT IMAGES ===')
  const prods = await client.query('SELECT id, name_en, images FROM "Product"')
  for (const p of prods.rows) {
    const newImage = PRODUCT_IMAGES[p.name_en]
    if (!newImage) { console.log('  SKIP: ' + p.name_en); continue }
    const cur = p.images && p.images[0]
    if (cur === newImage) { console.log('  OK:   ' + p.name_en); continue }
    await client.query('UPDATE "Product" SET images = ARRAY[$1, $2]::text[] WHERE id = $3', [newImage, newImage, p.id])
    console.log('  FIXED: ' + p.name_en + '  was: ' + cur + '  now: ' + newImage)
  }

  // Verify
  console.log('\n=== VERIFICATION ===')
  const vCols = await client.query('SELECT name_en, "coverImage" FROM "Collection" ORDER BY "sortOrder"')
  for (const c of vCols.rows) {
    const exists = fs.existsSync('public' + c.coverImage)
    console.log('  ' + c.name_en + ': ' + c.coverImage + (exists ? ' OK' : ' MISSING'))
  }
  const vProds = await client.query('SELECT name_en, images FROM "Product" ORDER BY "sortOrder"')
  for (const p of vProds.rows) {
    const exists = fs.existsSync('public' + p.images[0])
    console.log('  ' + p.name_en + ': ' + p.images[0] + (exists ? ' OK' : ' MISSING'))
  }

  await client.end()
  console.log('\nDone!')
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1) })

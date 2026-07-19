import { Client } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL!

// ============================================================
// IMAGE MAPPING: product name → correct local upload path
// Based on visual inspection of all 14 valid uploaded images:
//
// Classic collection:
//   079a49ab = Classic Black  (black dial, leather strap, on rocks)
//   16f524af = Classic Gold   (gold case, silver dial)
//   550f3103 = Classic Silver (silver dial, steel bracelet, dark bg)
//   5ef796bd = Classic Ceramic (silver dial, lighter bg, close-up)
//
// Ocean collection:
//   19f515f2 = Ocean Blue    (blue diver, steel bracelet)
//   9aaf61b6 = Ocean Green   (green diver, steel bracelet)
//   869c51ce = Ocean Coral   (white ceramic diver)
//   c7325686 = Ocean Carbon  (blue dial, underwater bubbles)
//
// Night collection:
//   b6b60dc7 = Night Dark    (dark dial, forest/moon background)
//   b9664d32 = Night Silver  (dark dial, steel bracelet, on rocks)
//   (no violet-specific image — using Night Dark as fallback)
//   (no night-gold-specific image — using Night Silver as fallback)
// ============================================================

const PRODUCT_IMAGES: Record<string, string> = {
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
  'Night Violet':    '/uploads/b6b60dc7-b9ef-499b-92f1-57f04a2f6e53.png', // fallback: same as Night Dark
  'Night Gold':      '/uploads/b9664d32-bb7e-402c-8ffd-167cec0f818b.png', // fallback: same as Night Silver
}

// Collection cover images — pick best representative from each collection
const COLLECTION_COVERS: Record<string, string> = {
  'deniz-classic': '/uploads/550f3103-ba78-4ee6-9aaf-0a452cf1a3cd.png', // Classic Silver
  'deniz-ocean':   '/uploads/19f515f2-8acd-4d65-bf12-99d81bd7f130.png', // Ocean Blue
  'deniz-night':   '/uploads/b6b60dc7-b9ef-499b-92f1-57f04a2f6e53.png', // Night Dark
}

async function main() {
  const client = new Client({ connectionString: DATABASE_URL, connectionTimeoutMillis: 15000 })
  await client.connect()

  console.log('Connected to production database.\n')

  // ── Fix Collection coverImages ──────────────────────────────
  console.log('=== FIXING COLLECTION COVER IMAGES ===')
  const cols = await client.query('SELECT id, name_en, slug, "coverImage" FROM "Collection"')
  for (const c of cols.rows) {
    const newCover = COLLECTION_COVERS[c.slug]
    if (!newCover) {
      console.log(`  SKIP: ${c.name_en} (slug: ${c.slug}) — no mapping defined`)
      continue
    }
    if (c.coverImage === newCover) {
      console.log(`  OK:   ${c.name_en} — already correct (${c.coverImage})`)
      continue
    }
    await client.query('UPDATE "Collection" SET "coverImage" = $1 WHERE id = $2', [newCover, c.id])
    console.log(`  FIXED: ${c.name_en}`)
    console.log(`    was: ${c.coverImage}`)
    console.log(`    now: ${newCover}`)
  }

  // ── Fix Product images ──────────────────────────────────────
  console.log('\n=== FIXING PRODUCT IMAGES ===')
  const prods = await client.query('SELECT id, name_en, images FROM "Product"')
  for (const p of prods.rows) {
    const newImage = PRODUCT_IMAGES[p.name_en]
    if (!newImage) {
      console.log(`  SKIP: ${p.name_en} — no mapping defined`)
      continue
    }
    const currentFirst = p.images?.[0]
    if (currentFirst === newImage) {
      console.log(`  OK:   ${p.name_en} — already correct`)
      continue
    }
    // Set both image slots to the same correct image
    await client.query('UPDATE "Product" SET images = $1 WHERE id = $2', [JSON.stringify([newImage, newImage]), p.id])
    console.log(`  FIXED: ${p.name_en}`)
    console.log(`    was: ${currentFirst}`)
    console.log(`    now: ${newImage}`)
  }

  // ── Verify ──────────────────────────────────────────────────
  console.log('\n=== VERIFICATION ===')
  const verifyCols = await client.query('SELECT name_en, slug, "coverImage" FROM "Collection" ORDER BY "sortOrder"')
  console.log('Collections:')
  for (const c of verifyCols.rows) {
    const fs = require('fs')
    const filePath = `public${c.coverImage}`
    const exists = fs.existsSync(filePath)
    console.log(`  ${c.name_en}: ${c.coverImage} ${exists ? '✓ file exists' : '✗ FILE MISSING'}`)
  }

  const verifyProds = await client.query('SELECT name_en, images FROM "Product" ORDER BY "sortOrder"')
  console.log('Products:')
  for (const p of verifyProds.rows) {
    const fs = require('fs')
    const filePath = `public${p.images[0]}`
    const exists = fs.existsSync(filePath)
    console.log(`  ${p.name_en}: ${p.images[0]} ${exists ? '✓ file exists' : '✗ FILE MISSING'}`)
  }

  await client.end()
  console.log('\nDone!')
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1) })

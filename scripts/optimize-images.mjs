// Converts the PNG/JPEG fills exported from Figma into right-sized WebP.
// Re-run after re-exporting assets: `node scripts/optimize-images.mjs`
import sharp from 'sharp'
import { readdir, unlink, stat } from 'node:fs/promises'
import { join } from 'node:path'

const DIRS = ['src/assets/img', 'src/assets/img/food']

// width the asset is actually displayed at, x2 for high-DPI screens
const TARGETS = {
  'chef-marco': 962,
  'chef-daniel': 962,
  'chef-claire': 962,
  'chef-sofia': 962,
  'chef-marco-portrait': 800,
  'avatar-larry': 96,
  'michelin-star': 64,
  'lesson-knife': 256,
  'lesson-truffle': 256,
  'lesson-video-frame': 640,
}
// Learn-card thumbnails render at 40px; 2x is plenty.
const DEFAULT_WIDTH = 96

for (const DIR of DIRS) {
  const files = (await readdir(DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f))
  for (const file of files) {
  const name = file.replace(/\.(png|jpe?g)$/i, '')
  const src = join(DIR, file)
  const before = (await stat(src)).size
  const width = TARGETS[name] ?? DEFAULT_WIDTH
  const meta = await sharp(src).metadata()
  const target = Math.min(width, meta.width)
  await sharp(src)
    .resize({ width: target, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(join(DIR, `${name}.webp`))
  const after = (await stat(join(DIR, `${name}.webp`))).size
  await unlink(src)
  console.log(`${name}: ${(before / 1024).toFixed(0)}kb -> ${(after / 1024).toFixed(0)}kb (${meta.width} -> ${target}px)`)
  }
}

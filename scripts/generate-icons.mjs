// Generates the PWA icon set (V-monogram) into /public/icons.
// Run: node scripts/generate-icons.mjs
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const OUT = new URL('../public/icons', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })

const ULTRAMARINE = '#2440C9'
const PAPER = '#F7F8F6'
const GOLD = '#B98A1F'

// "V." — the monogram plus a decisive gold full stop.
function monogram({ maskable }) {
  // Maskable icons must keep content inside the central safe zone (~60%).
  const s = maskable ? 0.72 : 1
  const cx = 256
  const cy = 256
  const x = (v) => cx + (v - cx) * s
  const y = (v) => cy + (v - cy) * s
  const stroke = 58 * s
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" ${maskable ? '' : 'rx="96"'} fill="${ULTRAMARINE}"/>
  <polyline points="${x(142)},${y(148)} ${x(240)},${y(368)} ${x(338)},${y(148)}"
    fill="none" stroke="${PAPER}" stroke-width="${stroke}" stroke-linecap="square"/>
  <circle cx="${x(392)}" cy="${y(340)}" r="${30 * s}" fill="${GOLD}"/>
</svg>`
}

const jobs = [
  { file: 'icon-192.png', size: 192, maskable: false },
  { file: 'icon-512.png', size: 512, maskable: false },
  { file: 'icon-maskable-512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180, maskable: true },
]

for (const { file, size, maskable } of jobs) {
  await sharp(Buffer.from(monogram({ maskable })))
    .resize(size, size)
    .png()
    .toFile(join(OUT, file))
  console.log(`${file} (${size}×${size})`)
}

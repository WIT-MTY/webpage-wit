// Builds the acrylic keychain charm from Lumi's illustration.
//
//   node scripts/make-keychain.mjs
//
// In:  public/lumi.webp
// Out: public/lumi-keychain.webp       Lumi on a clear acrylic die-cut, with a tab + punched hole
//      public/lumi-keychain-mask.png   alpha silhouette of the final shape (glint clip)
//      components/lumi-keychain.json   image size and hole position, read by LumiKeychain.tsx
//
// Uses sharp (installed with Next.js; not a direct dependency of this project).

import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'

const SRC = 'public/lumi.webp'
const OUT = 'public/lumi-keychain.webp'
const MASK = 'public/lumi-keychain-mask.png'
const GEOMETRY = 'components/lumi-keychain.json'

const BORDER = 14 // acrylic border around her silhouette, native px
// Closing radius: rounds inside corners and fills narrow gaps (between the
// antennae, arm and body) with acrylic, like a real die-cut.
const SMOOTH = 34
// Working margin: the dilation must never reach the canvas edge. The output is cropped.
const PAD = BORDER + SMOOTH + 4
const SOLID = 40 // alpha above this counts as Lumi; fainter halo is ignored
const TAB_R = 26 // tab half-width (its top is a semicircle)
const TAB_RISE = 85 // how far the tab rises above the acrylic between the antennae
const TAB_CLEAR = 10 // minimum air between the tab and an antenna's border
const HOLE_R = 14
const HOLE_FROM_TOP = TAB_R // hole centered in the tab's round top

const ACRYLIC = 0.72 // translucent tinted fill
const EDGE = 0.95 // 1px bright edge line
const HIGHLIGHT = 0.25 // inner highlight along the top-left edge
// Tinted acrylic: lilac (a brighter take on --color-peri) at the top-left, fading to a
// soft pink (wit-pink lightened) at the bottom-right. Edge and highlight lean white.
const TINT_FROM = [196, 178, 255]
const TINT_TO = [255, 158, 204]
const mix = (from, to, t) => from.map((c, k) => c + (to[k] - c) * t)

const clamp01 = (v) => Math.min(1, Math.max(0, v))

// Exact Euclidean distance transform (Felzenszwalb & Huttenlocher).
// `feature[i]` = 1 marks the pixels distances are measured to.
function edt(feature, W, H) {
  const INF = 1e20
  const grid = new Float64Array(W * H)
  for (let i = 0; i < W * H; i++) grid[i] = feature[i] ? 0 : INF
  const n = Math.max(W, H)
  const f = new Float64Array(n)
  const d = new Float64Array(n)
  const v = new Int32Array(n)
  const z = new Float64Array(n + 1)
  const pass = (len, get, set) => {
    for (let q = 0; q < len; q++) f[q] = get(q)
    let k = 0
    v[0] = 0
    z[0] = -INF
    z[1] = INF
    for (let q = 1; q < len; q++) {
      let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
      while (s <= z[k]) {
        k--
        s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
      }
      k++
      v[k] = q
      z[k] = s
      z[k + 1] = INF
    }
    k = 0
    for (let q = 0; q < len; q++) {
      while (z[k + 1] < q) k++
      d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]
    }
    for (let q = 0; q < len; q++) set(q, d[q])
  }
  for (let x = 0; x < W; x++) pass(H, (y) => grid[y * W + x], (y, val) => (grid[y * W + x] = val))
  for (let y = 0; y < H; y++) pass(W, (x) => grid[y * W + x], (x, val) => (grid[y * W + x] = val))
  for (let i = 0; i < W * H; i++) grid[i] = Math.sqrt(grid[i])
  return grid
}

const { data: lumi, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const w0 = info.width
const h0 = info.height
const solid = (x, y) => lumi[(y * w0 + x) * 4 + 3] > SOLID

// Her head is the widest row in the top half.
let headRow = 0
let headLeft = 0
let headRight = 0
for (let y = 0; y < h0 / 2; y++) {
  let left = -1
  let right = -1
  for (let x = 0; x < w0; x++) {
    if (solid(x, y)) {
      if (left < 0) left = x
      right = x
    }
  }
  if (right - left > headRight - headLeft) {
    headRow = y
    headLeft = left
    headRight = right
  }
}
const headCenter = Math.round((headLeft + headRight) / 2)

// The tab goes in the gap between the antenna stalks: the lowest row (closest
// to her head) where the gap clears the tab plus both antennae's borders.
const gapNeeded = 2 * (TAB_R + BORDER + TAB_CLEAR)
let tabCenter = headCenter
for (let y = headRow; y >= 0; y--) {
  let best = null
  let runEnd = -1
  for (let x = headLeft; x <= headRight; x++) {
    if (!solid(x, y)) continue
    if (runEnd >= 0 && x - runEnd - 1 >= gapNeeded) {
      const mid = (runEnd + x) / 2
      if (!best || Math.abs(mid - headCenter) < Math.abs(best - headCenter)) best = mid
    }
    runEnd = x
  }
  if (best !== null) {
    tabCenter = Math.round(best)
    break
  }
}

// Canvas: Lumi padded on every side, plus room on top for the tab.
const offX = PAD
const offY = PAD + TAB_RISE
const W = w0 + 2 * PAD
const H = h0 + offY + PAD

const silhouette = new Uint8Array(W * H)
for (let y = 0; y < h0; y++) for (let x = 0; x < w0; x++) if (solid(x, y)) silhouette[(y + offY) * W + x + offX] = 1
const toLumi = edt(silhouette, W, H)

// Dilate by BORDER + SMOOTH, then erode by SMOOTH: keeps the border width,
// rounds inside corners and bridges narrow gaps. `extra` adds the tab.
function dieCut(extra) {
  const grown = new Uint8Array(W * H)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x
      grown[i] = toLumi[i] <= BORDER + SMOOTH || extra(x, y) <= SMOOTH ? 1 : 0
    }
  }
  const outside = new Uint8Array(W * H)
  for (let i = 0; i < W * H; i++) outside[i] = grown[i] ? 0 : 1
  return edt(outside, W, H) // distance to outside; the edge sits at SMOOTH
}

// Pass 1, no tab: find where the acrylic between the antennae ends on the tab's column.
const pass1 = dieCut(() => Infinity)
const cx = tabCenter + offX
let fillTop = (headRow + offY) | 0
while (fillTop > 0 && pass1[(fillTop - 1) * W + cx] > SMOOTH) fillTop--

// Tab: a rectangle with a semicircular top, rising TAB_RISE above that point.
const tabTop = fillTop - TAB_RISE
const tabBottom = fillTop + SMOOTH // sinks into the acrylic so the two are one piece
const holeX = cx
const holeY = tabTop + HOLE_FROM_TOP
function tabDistance(x, y) {
  const capY = tabTop + TAB_R
  const dCap = Math.hypot(x - cx, y - capY) - TAB_R
  const dx = Math.abs(x - cx) - TAB_R
  const dy = Math.max(capY - y, y - tabBottom)
  const dBox = Math.min(Math.max(dx, dy), 0) + Math.hypot(Math.max(dx, 0), Math.max(dy, 0))
  return Math.min(dCap, dBox)
}

// Pass 2, with the tab.
const toOutside = dieCut(tabDistance)

// Distance from each pixel to the final edge (positive inside), hole included.
const inset = new Float64Array(W * H)
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x
    const toHole = Math.hypot(x - holeX, y - holeY) - HOLE_R
    inset[i] = Math.min(toOutside[i] - SMOOTH, toHole)
  }
}

const out = Buffer.alloc(W * H * 4)
const mask = Buffer.alloc(W * H * 4)
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x
    const e = inset[i]
    const shape = clamp01(e + 0.5) // anti-aliased edge
    if (shape === 0) continue

    // Acrylic: translucent tinted fill, brighter near-white 1px edge line.
    const edge = clamp01(1.6 - e)
    let a = ACRYLIC + (EDGE - ACRYLIC) * edge
    let tint = mix(TINT_FROM, TINT_TO, clamp01((x / W + y / H) / 2 * 1.4 - 0.2))
    tint = mix(tint, [255, 255, 255], edge * 0.7)

    // Inner highlight on edges facing the top-left light.
    if (e > 1.5 && e < 7) {
      const gx = inset[i + 1] - inset[i - 1]
      const gy = inset[i + W] - inset[i - W]
      const len = Math.hypot(gx, gy) || 1
      // The gradient points inward; a top-left edge has it pointing down-right.
      const facing = clamp01(((gx + gy) / len / Math.SQRT2 - 0.3) / 0.7)
      const glow = HIGHLIGHT * facing * (1 - (e - 1.5) / 5.5)
      a = Math.min(EDGE, a + glow)
      tint = mix(tint, [255, 255, 255], glow * 2)
    }
    a *= shape

    // Lumi on top of the acrylic, clipped to the die-cut.
    let [r, g, b] = tint
    const lx = x - offX
    const ly = y - offY
    if (lx >= 0 && ly >= 0 && lx < w0 && ly < h0) {
      const j = (ly * w0 + lx) * 4
      const la = (lumi[j + 3] / 255) * shape
      const outA = la + a * (1 - la)
      if (outA > 0) {
        r = (lumi[j] * la + tint[0] * a * (1 - la)) / outA
        g = (lumi[j + 1] * la + tint[1] * a * (1 - la)) / outA
        b = (lumi[j + 2] * la + tint[2] * a * (1 - la)) / outA
      }
      a = outA
    }

    out[i * 4] = r
    out[i * 4 + 1] = g
    out[i * 4 + 2] = b
    out[i * 4 + 3] = Math.round(a * 255)

    mask[i * 4] = 255
    mask[i * 4 + 1] = 255
    mask[i * 4 + 2] = 255
    mask[i * 4 + 3] = Math.round(shape * 255)
  }
}

// Crop to the charm plus a 2px margin.
let minX = W
let minY = H
let maxX = 0
let maxY = 0
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (mask[(y * W + x) * 4 + 3] > 0) {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  }
}
const crop = { left: minX - 2, top: minY - 2, width: maxX - minX + 5, height: maxY - minY + 5 }

const raw = { raw: { width: W, height: H, channels: 4 } }
await sharp(out, raw).extract(crop).webp({ quality: 90, alphaQuality: 100 }).toFile(OUT)
await sharp(mask, raw).extract(crop).png({ compressionLevel: 9 }).toFile(MASK)
const geometry = {
  width: crop.width,
  height: crop.height,
  holeX: holeX - crop.left,
  holeY: holeY - crop.top,
  holeR: HOLE_R,
}
await writeFile(GEOMETRY, JSON.stringify(geometry, null, 2) + '\n')

console.log(`${OUT} ${geometry.width}×${geometry.height}, hole at (${geometry.holeX}, ${geometry.holeY}) r=${HOLE_R}`)

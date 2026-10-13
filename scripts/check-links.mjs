// Link checker.
//
//   node scripts/check-links.mjs           scan the source for dead links
//   node scripts/check-links.mjs --remote  also request every external URL in lib/ and data/
//
// The scan looks in app/, components/ and lib/ for:
//   - href="#", empty hrefs, `?? '#'` / `|| '#'` fallbacks and javascript: URLs
//   - nullable URLs (string | null in lib/site.ts) passed to an href with no
//     null check nearby, which would render a dead link
// Exit code 1 if anything is found.

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const DIRS = ['app', 'components', 'lib']
const problems = []

async function files(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await files(p)))
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) out.push(p)
  }
  return out
}

// Nullable URL names: `export const X: string | null` and `field: string | null` in lib/site.ts.
const site = await readFile('lib/site.ts', 'utf8')
const nullable = new Set()
for (const m of site.matchAll(/export const (\w+): string \| null/g)) {
  if (/URL|EMAIL/i.test(m[1])) nullable.add(m[1])
}
for (const m of site.matchAll(/^\s+(\w*(?:url|Url|href|linkedin)\w*)\??: string \| null/gm)) nullable.add(m[1])

const DEAD = [
  [/href=\{?\s*(["'`])#?\1\s*\}?/, 'href is "#" or empty'],
  [/(\?\?|\|\|)\s*(["'`])#\2/, "falls back to '#' when the URL is missing"],
  [/javascript:/i, 'javascript: URL'],
]

for (const dir of DIRS) {
  for (const file of await files(dir)) {
    const lines = (await readFile(file, 'utf8')).split(/\r?\n/)
    lines.forEach((line, i) => {
      const where = `${file.replace(/\\/g, '/')}:${i + 1}`
      for (const [re, why] of DEAD) if (re.test(line)) problems.push(`${where}  ${why}\n    ${line.trim()}`)

      const href = line.match(/href=\{([^}]*)\}/)
      if (!href) return
      for (const name of nullable) {
        if (!new RegExp(`\\b${name}\\b`).test(href[1])) continue
        // Guarded if the URL is checked in the lines just above (ternary, &&, if, early return).
        const context = lines.slice(Math.max(0, i - 12), i + 1).join('\n')
        const guard = new RegExp(`\\b${name}\\b\\s*(\\?(?!\\?)|&&)|if\\s*\\(!?[\\w.]*\\b${name}\\b|\\b${name}\\b\\s*\\)\\s*\\?`)
        if (!guard.test(context)) problems.push(`${where}  ${name} can be null and reaches an href unchecked\n    ${line.trim()}`)
      }
    })
  }
}

if (problems.length) {
  console.log(`${problems.length} link problem(s):\n`)
  for (const p of problems) console.log(p + '\n')
} else {
  console.log('No dead links found in app/, components/, lib/.')
}

// Optional: request every external URL. Instagram, LinkedIn, Facebook and TikTok
// often block scripts (403/429/999) or show a login wall, so check those by hand.
if (process.argv.includes('--remote')) {
  const urls = new Set()
  for (const f of ['lib/site.ts', 'data/members.ts']) {
    for (const m of (await readFile(f, 'utf8')).matchAll(/https?:\/\/[^\s'"`)]+/g)) urls.add(m[0])
  }
  console.log('\nExternal URLs:')
  for (const url of urls) {
    let status = 'ERROR'
    for (const method of ['HEAD', 'GET']) {
      try {
        const res = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(10_000) })
        status = String(res.status)
        if (res.ok) break
      } catch (e) {
        status = `ERROR ${e.name}`
      }
    }
    const social = /instagram\.com|linkedin\.com|facebook\.com|tiktok\.com/.test(url)
    console.log(`  ${status.padEnd(12)} ${url}${social ? '  (social site: check by hand)' : ''}`)
  }
}

process.exit(problems.length ? 1 : 0)

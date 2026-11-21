// Run only AFTER the approved CI build: node scripts/check-ssg-output.mjs
// Read-only, target-specific check: no dependency on a full test suite.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const read = (name) => readFileSync(join(root, 'dist', name), 'utf8')
const index = read('index.html')
assert.match(index, /Integrate with WESSAAL/, 'Docs content must exist in generated HTML')
assert.match(index, /<h1[^>]*>/i, 'Generated HTML must contain a heading')
assert.ok(!/<div id="app"><\/div>/.test(index), 'Empty Vue SPA shell is not an SSG result')
assert.match(read('robots.txt'), /Sitemap: https:\/\/docs\.wessaal\.com\/sitemap\.xml/)
const sitemap = read('sitemap.xml')
assert.match(sitemap, /<urlset\b/)
assert.match(sitemap, /<loc>https:\/\/docs\.wessaal\.com\/?<\/loc>/)
console.log('PASS WSL-024 SSG output content, robots.txt, sitemap.xml')

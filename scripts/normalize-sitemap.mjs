import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'

const file = 'dist/sitemap.xml'
let sitemap = readFileSync(file, 'utf8')
const expected = ['/', '/quickstart/', '/authentication/', '/endpoints/', '/webhooks/']
sitemap = sitemap.replace(/<loc>https:\/\/docs\.wessaal\.com(\/[^<]*)<\/loc>/g, (_, path) => {
  const normalized = path.endsWith('/') ? path : path + '/'
  return '<loc>https://docs.wessaal.com' + normalized + '</loc>'
})
for (const path of expected) {
  assert.ok(sitemap.includes('<loc>https://docs.wessaal.com' + path + '</loc>'), 'Missing canonical sitemap route: ' + path)
}
assert.equal((sitemap.match(/<loc>/g) || []).length, expected.length)
writeFileSync(file, sitemap)
console.log('PASS sitemap canonical trailing slashes for five public routes')

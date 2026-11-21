import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(process.cwd(), 'dist')
const read = name => readFileSync(join(root, name), 'utf8')
const routes = [
  ['', 'Integrate with WESSAAL'],
  ['quickstart/', 'Quickstart'],
  ['authentication/', 'Authentication'],
  ['endpoints/', 'API Endpoints'],
  ['webhooks/', 'Webhooks and delivery events'],
]
const titles = new Set()
const descriptions = new Set()
for (const [route, heading] of routes) {
  const html = read(route + 'index.html')
  const path = route ? '/' + route : '/'
  assert.match(html, /<h1\b[^>]*>/i, path + ' missing H1')
  assert.ok(html.includes(heading), path + ' missing readable route content')
  assert.ok(!/<div id="app"><\/div>/.test(html), path + ' is an empty SPA shell')
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]
  const desc = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)?.[1]
    || html.match(/<meta[^>]*content="([^"]+)"[^>]*name="description"/i)?.[1]
  assert.ok(title, path + ' missing title')
  assert.ok(desc, path + ' missing meta description')
  assert.ok(!titles.has(title), path + ' duplicate title')
  assert.ok(!descriptions.has(desc), path + ' duplicate meta description')
  titles.add(title)
  descriptions.add(desc)
  assert.ok(html.includes('https://docs.wessaal.com' + path), path + ' missing canonical')
  assert.match(html, /rel="canonical"/, path + ' missing canonical link')
  assert.match(html, /TechArticle/, path + ' missing TechArticle JSON-LD')
  assert.match(html, /BreadcrumbList/, path + ' missing BreadcrumbList JSON-LD')
}
const robots = read('robots.txt')
for (const bot of ['Googlebot','Bingbot','OAI-SearchBot','ChatGPT-User','PerplexityBot','ClaudeBot','Google-Extended']) {
  assert.ok(robots.includes('User-agent: ' + bot), 'missing ' + bot)
}
assert.match(robots, /Sitemap: https:\/\/docs\.wessaal\.com\/sitemap\.xml/)
const sitemap = read('sitemap.xml')
for (const [route] of routes) {
  assert.ok(sitemap.includes('https://docs.wessaal.com/' + route), 'missing sitemap route /' + route)
}
assert.equal((sitemap.match(/<loc>/g) || []).length, routes.length, 'sitemap must have exactly 5 canonical routes')
const llms = read('llms.txt')
const full = read('llms-full.txt')
for (const [route] of routes) assert.ok(llms.includes('https://docs.wessaal.com/' + route))
assert.match(full, /X-API-Key/)
assert.match(full, /messageId.*status/)
assert.match(full, /webhook subscription/)
console.log('PASS WSL-012/015/016: five independently pre-rendered HTML pages, unique metadata, TechArticle + BreadcrumbList JSON-LD, crawler rules, llms.txt, llms-full.txt and sitemap.')

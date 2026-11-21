import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

test("docs must invoke the SSG CLI rather than the SPA-only Vite build", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.scripts.build, "vite-ssg build");
  assert.match(read("src/main.js"), /ViteSSG\(/);
  assert.match(read("vite.config.js"), /onFinished\(\)/);
  assert.match(read("vite.config.js"), /generateSitemap\(/);
  assert.match(read("vite.config.js"), /return paths\.filter\(path => path === '\/'\)/);
});

test("robots declares public sitemap and production nginx returns 404 for unknown routes", () => {
  assert.match(read("public/robots.txt"), /^User-agent:\s*\*/im);
  assert.match(read("public/robots.txt"), /^Allow:\s*\//im);
  assert.match(read("public/robots.txt"), /https:\/\/docs\.wessaal\.com\/sitemap\.xml/);
  const nginx = read("deploy/nginx-docs-locations.conf.example");
  assert.match(nginx, /location \/ \{[\s\S]*?try_files \$uri \$uri\/ =404;/);
  assert.match(nginx, /error_page 404 \/404\.html;/);
  assert.match(read("public/404.html"), /<meta name="robots" content="noindex, nofollow">/);
});

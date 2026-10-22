import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://www.houseinmeta.com';
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const sitemap = read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.equal(urls.length, new Set(urls).size, 'Duplicate sitemap URL');
const products = urls.filter(u => ![`${origin}/`, `${origin}/fr/`, `${origin}/contact.html`].includes(u));
assert.equal(products.length, 9);
let jsonCount = 0;
for (const url of urls) {
  const pathname = new URL(url).pathname;
  const file = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const html = read(file.slice(1));
  if (pathname === '/contact.html') continue;
  assert.equal([...html.matchAll(/rel="canonical"/g)].length, 1, file);
  assert.ok(html.includes(`rel="canonical" href="${url}"`), `Canonical: ${file}`);
  assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1, `H1: ${file}`);
  assert.ok(!html.includes('\uFFFD'), `Encoding: ${file}`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    JSON.parse(match[1]);
    jsonCount++;
  }
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const target = match[1].endsWith('/') ? `${match[1]}index.html` : match[1];
    assert.ok(fs.existsSync(path.join(root, target.slice(1))), `Missing local target ${target} in ${file}`);
  }
  if (products.includes(url)) {
    const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)];
    assert.equal(alternates.length, 10, `Language annotations: ${file}`);
    for (const product of products) assert.ok(alternates.some(m => m[2] === product), `Missing reciprocal alternate ${product}`);
    const lang = html.match(/<html lang="([^"]+)"/)[1];
    assert.ok(alternates.some(m => m[1] === lang && m[2] === url));
    if (lang === 'ar') assert.ok(html.includes('dir="rtl"'));
  }
}
assert.ok(read('robots.txt').includes(`Sitemap: ${origin}/sitemap.xml`));
console.log(`SEO checks passed: ${products.length} product languages, ${urls.length} sitemap URLs, ${jsonCount} valid JSON-LD blocks, local links and reciprocal hreflang.`);

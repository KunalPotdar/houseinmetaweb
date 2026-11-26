import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const blogFiles = fs.readdirSync(path.join(root, 'pages/blog')).filter(file => file.endsWith('.html')).map(file => `pages/blog/${file}`);
const files = [...new Set([...execFileSync('git', ['ls-files', '*.html'], { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/), ...blogFiles])];
const adSnippet = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3386025353566002"\n     crossorigin="anonymous"></script>';
for (const file of files) {
  const html = read(file);
  if (blogFiles.includes(file)) {
    const normalized = html.replaceAll('\r\n', '\n');
    assert.equal(normalized.split('adsbygoogle.js').length - 1, 1, `Exactly one AdSense loader required: ${file}`);
    assert.ok(normalized.slice(0, normalized.indexOf('</head>')).includes(adSnippet), `Publisher snippet must be in the head: ${file}`);
    assert.ok(!/adsbygoogle|data-ad-slot|googlesyndication\.com|doubleclick\.net/i.test(normalized.replace(adSnippet, '')), `Unexpected extra ad code: ${file}`);
  } else {
    assert.ok(!/adsbygoogle|data-ad-slot|googlesyndication\.com|doubleclick\.net/i.test(html), `Ad scripts are restricted to blog pages: ${file}`);
  }
  assert.ok(!/googletagmanager\.com|google-analytics\.com|gtag\('config'/i.test(html), `Analytics bypasses opt-in: ${file}`);
  const publicPage = !/^(clients\/|assets\/|360-viewer\.html|404\.html|privacy-policy\.html)/.test(file);
  if (publicPage) assert.ok(html.includes('href="/privacy-policy.html"'), `Missing privacy link: ${file}`);
  for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
    const target = match[1].endsWith('/') ? `${match[1]}index.html` : match[1];
    assert.ok(fs.existsSync(path.join(root, target.slice(1))), `Missing local target ${target} in ${file}`);
  }
}
for (const file of ['index.html', 'en/index.html', 'fr/index.html', 'careers/3d-creative-artist.html', 'privacy-policy.html']) {
  assert.equal((read(file).match(/src="\/assets\/js\/privacy.js"/g) || []).length, 1, `Privacy controller: ${file}`);
  assert.ok(read(file).includes(file === 'privacy-policy.html' ? 'id="cookies"' : '/privacy-policy.html#cookies'), `Preferences access: ${file}`);
}
assert.ok(!read('scripts/build-seo.mjs').includes('adsbygoogle'), 'SEO generation must not reintroduce ad scripts');
assert.ok(read('index.html').includes('name="google-adsense-account" content="ca-pub-3386025353566002"'));
assert.equal(read('ads.txt').trim(), 'google.com, pub-3386025353566002, DIRECT, f08c47fec0942fa0');
const privacy = read('privacy-policy.html');
assert.ok(!/\[Your Company Address\]|GDPR Compliant|Privacy Shield|dpo@houseinmeta/.test(privacy));
assert.ok(privacy.includes('id="advertising"') && privacy.includes('data-analytics-choice="deny"'));
console.log(`Publisher checks passed: ${files.length} HTML pages; one AdSense snippet on each of ${blogFiles.length} blog pages only, analytics opt-in, privacy links and ads.txt verified. Live CMP configuration is not checked.`);

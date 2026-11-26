import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../assets/js/privacy.js', import.meta.url), 'utf8');
function run({ saved = null, pathname = '/', brokenStorage = false } = {}) {
  const scripts = [], events = {}, cookies = [];
  const status = { textContent: '' };
  const controls = ['deny', 'allow'].map(value => ({ hidden: true, dataset: { analyticsChoice: value }, addEventListener(event, callback) { this[event] = callback; } }));
  let stored = saved, reloaded = false;
  const document = {
    head: { appendChild(script) { scripts.push(script); } },
    createElement() { return {}; }, getElementById() { return status; }, querySelectorAll() { return controls; },
    get cookie() { return '_ga=test; _ga_ABC=test; unrelated=keep'; }, set cookie(value) { cookies.push(value); }
  };
  const window = { addEventListener(event, callback) { events[event] = callback; } };
  const location = { pathname, origin: 'https://www.houseinmeta.com', hostname: 'www.houseinmeta.com', reload() { reloaded = true; } };
  const localStorage = {
    getItem() { if (brokenStorage) throw Error('blocked'); return stored; },
    setItem(key, value) { if (brokenStorage) throw Error('blocked'); stored = value; }
  };
  vm.runInNewContext(source, { window, document, location, localStorage, Date });
  return { window, scripts, controls, status, events, cookies, get stored() { return stored; }, get reloaded() { return reloaded; } };
}
const preference = (allowed, savedAt = Date.now()) => JSON.stringify({ allowed, savedAt });

test('no, denied, invalid, future or expired choice never contacts analytics', () => {
  for (const saved of [null, preference(false), '{bad json', preference('yes'), preference(true, Date.now() + 60000), preference(true, Date.now() - 181 * 86400000)]) {
    const result = run({ saved });
    assert.equal(result.scripts.length, 0);
    assert.equal(result.window['ga-disable-G-PMZ17T07L5'], true);
    assert.ok(result.cookies.every(value => !value.startsWith('unrelated=')));
  }
});
test('valid opt-in loads analytics only on eligible pages and keeps ad consent denied', () => {
  for (const pathname of ['/', '/index.html', '/en/', '/en/index.html', '/fr/', '/fr/index.html', '/careers/3d-creative-artist.html']) {
    const result = run({ saved: preference(true), pathname });
    assert.equal(result.scripts.length, 1);
    const consent = result.window.dataLayer[0][2];
    assert.equal(consent.analytics_storage, 'granted');
    assert.equal(consent.ad_storage, 'denied');
    assert.equal(consent.ad_personalization, 'denied');
    assert.equal(result.window.dataLayer[2][2].page_location, 'https://www.houseinmeta.com' + pathname);
  }
  for (const pathname of ['/privacy-policy.html', '/contact.html', '/clients/Maison/Maison.html', '/pages/blog/interactive-apartment-selection.html']) {
    assert.equal(run({ saved: preference(true), pathname }).scripts.length, 0);
  }
});
test('preferences save an explicit choice and revocation disables analytics', () => {
  const result = run({ pathname: '/privacy-policy.html' });
  assert.ok(result.controls.every(control => control.hidden === false));
  result.controls[1].click();
  assert.equal(JSON.parse(result.stored).allowed, true);
  assert.equal(run({ saved: result.stored }).scripts.length, 1);
  result.controls[0].click();
  assert.equal(JSON.parse(result.stored).allowed, false);
  assert.equal(result.window['ga-disable-G-PMZ17T07L5'], true);
  assert.equal(run({ saved: result.stored }).scripts.length, 0);
});
test('unavailable storage fails closed and reports the problem', () => {
  const result = run({ brokenStorage: true });
  result.controls[1].click();
  assert.equal(result.scripts.length, 0);
  assert.equal(result.window['ga-disable-G-PMZ17T07L5'], true);
  assert.match(result.status.textContent, /could not save/);
});
test('preference changes or clearing storage stop analytics in other tabs', () => {
  for (const key of ['houseinmeta.analytics.v1', null]) {
    const result = run({ saved: preference(true) });
    result.events.storage({ key });
    assert.equal(result.window['ga-disable-G-PMZ17T07L5'], true);
    assert.equal(result.reloaded, true);
  }
});

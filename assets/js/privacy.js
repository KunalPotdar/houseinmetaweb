/* Optional analytics only. This is not an advertising CMP or a TCF implementation. */
(() => {
  'use strict';
  const key = 'houseinmeta.analytics.v1';
  const measurementId = 'G-PMZ17T07L5';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const analyticsPage = /^(?:\/(?:index\.html)?|\/(?:en|fr)\/(?:index\.html)?|\/careers\/3d-creative-artist\.html)$/.test(location.pathname);
  let choice = null;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && typeof saved.allowed === 'boolean' && Number.isFinite(saved.savedAt) &&
        saved.savedAt <= Date.now() && Date.now() - saved.savedAt < lifetime) choice = saved.allowed;
  } catch (_) { /* Storage unavailable or invalid: optional analytics stays off. */ }

  const disabledKey = `ga-disable-${measurementId}`;
  window[disabledKey] = choice !== true;
  function clearAnalyticsCookies() {
    const domains = ['', location.hostname];
    const parts = location.hostname.split('.');
    while (parts.length > 1) { domains.push(`.${parts.join('.')}`); parts.shift(); }
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) return;
      domains.forEach(domain => {
        document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''} SameSite=Lax`;
      });
    });
  }
  if (choice !== true) clearAnalyticsCookies();
  if (choice === true && analyticsPage) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false, allow_ad_personalization_signals: false,
      // Do not send query strings or fragments from enquiry links to analytics.
      page_location: location.origin + location.pathname,
      page_referrer: ''
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  const status = document.getElementById('analytics-status');
  function showStatus(persisted = true) {
    if (status) status.textContent = persisted
      ? (choice === true ? 'Optional analytics is allowed on this browser. You can change this choice at any time.' : 'Optional analytics is off. You can use the website without accepting it.')
      : 'Your browser could not save this choice. Optional analytics remains off.';
  }
  showStatus();
  document.querySelectorAll('[data-analytics-choice]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      const allowed = button.dataset.analyticsChoice === 'allow';
      let persisted = true;
      try { localStorage.setItem(key, JSON.stringify({ allowed, savedAt: Date.now() })); }
      catch (_) { persisted = false; }
      choice = persisted ? allowed : false;
      window[disabledKey] = choice !== true;
      if (choice !== true) clearAnalyticsCookies();
      showStatus(persisted);
    });
  });
  // Revoke immediately in any already-open page, then discard loaded analytics code.
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      window[disabledKey] = true;
      location.reload();
    }
  });
})();

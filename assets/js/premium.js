/* Shared navigation and progressively loaded property preview. */
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  const closeMenu = () => { nav?.classList.remove('is-open'); toggle?.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); } });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('is-pending'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('is-pending'); observer.observe(el); });
    reduced.addEventListener('change', () => {
      if (reduced.matches) { document.querySelectorAll('.is-pending').forEach(el => el.classList.remove('is-pending')); observer.disconnect(); }
    });
  }
  const stage = document.getElementById('experience-stage');
  if (!stage) return;
  const fr = document.documentElement.lang === 'fr';
  const status = stage.querySelector('.experience-status');
  let viewer;
  function fail() {
    viewer?.destroy(); viewer = null;
    stage.classList.remove('is-live'); stage.removeAttribute('aria-busy');
    status.hidden = false;
    status.textContent = fr ? 'L’aperçu est indisponible. Demandez le lien de visite via le formulaire.' : 'The preview is unavailable. Request the tour link using the form.';
  }
  async function loadPreview() {
    stage.setAttribute('aria-busy', 'true');
    status.hidden = false;
    status.textContent = fr ? 'Préparation de votre visite…' : 'Preparing your virtual visit…';
    try {
      if (!window.pannellum) {
        if (!document.querySelector('[data-panorama-css]')) {
          const css = document.createElement('link'); css.rel = 'stylesheet';
          css.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
          css.dataset.panoramaCss = ''; document.head.append(css);
        }
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
          script.onload = resolve; script.onerror = () => { script.remove(); reject(new Error('Panorama library unavailable')); };
          document.head.append(script);
        });
      }
      stage.classList.add('is-live');
      viewer = window.pannellum.viewer('panorama-widget', {
        type: 'equirectangular', panorama: 'https://apt-hsim-models.s3.eu-west-3.amazonaws.com/ParcDeLac/360-ext.png',
        autoLoad: true, showControls: false, mouseZoom: false, draggable: false, hfov: 100,
        autoRotate: reduced.matches ? 0 : -2,
        strings: { loadingLabel: fr ? 'Chargement…' : 'Loading…' }
      });
      viewer.on('load', () => {
        status.hidden = true; stage.removeAttribute('aria-busy');
        reduced.addEventListener('change', () => {
          if (!viewer) return;
          if (reduced.matches) viewer.stopAutoRotate();
          else viewer.startAutoRotate(-2);
        });
      });
      viewer.on('error', fail);
    } catch { fail(); }
  }
  if ('IntersectionObserver' in window) {
    const previewObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { previewObserver.disconnect(); loadPreview(); }
    }, { rootMargin: '150px' });
    previewObserver.observe(stage);
  } else loadPreview();
})();

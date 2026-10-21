/* =========================================================
   YUKAS — hero-image.js
   Preloads images/hero.jpg. If loaded, injects .hero-photo
   inside .hero-card before .dashboard-mockup. Silent no-op
   on failure.
   ========================================================= */
(function () {
  'use strict';
  try {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    /* ---------- Constants ---------- */
    var HERO_IMAGE = 'images/hero.jpg';
    var HERO_ALT = 'YUKAS DIGITAL HUB team working on AI and digital systems';

    /* ---------- Find insertion point ---------- */
    var heroCard = document.querySelector('.hero-card');
    if (!heroCard) return;

    var dashboard = heroCard.querySelector('.dashboard-mockup');
    if (!dashboard) return;

    /* ---------- Preload the image first ---------- */
    var probe = new Image();
    probe.onload = function () {
      try {
        if (document.querySelector('.hero-card .hero-photo')) return;

        var wrap = document.createElement('div');
        wrap.className = 'hero-photo';

        var img = document.createElement('img');
        img.src = HERO_IMAGE;
        img.alt = HERO_ALT;
        img.loading = 'eager';
        img.decoding = 'async';

        wrap.appendChild(img);
        heroCard.insertBefore(wrap, dashboard);
      } catch (err) {
        if (window.console && console.warn) {
          console.warn('[hero-image.js] inject failed:', err && err.message);
        }
      }
    };
    probe.onerror = function () {
      /* Silent — do nothing */
    };
    probe.src = HERO_IMAGE;
  } catch (err) {
    if (window.console && console.warn) {
      console.warn('[hero-image.js] disabled:', err && err.message);
    }
  }
})();

/* =========================================================
   YUKAS — enhance.js
   All-in-one IIFE with try/catch. No-op on failure.
   ========================================================= */
(function () {
  'use strict';
  try {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    var prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. Scroll-progress bar ---------- */
    if (!prefersReduced) {
      var progress = document.createElement('div');
      progress.className = 'ydh-scroll-progress';
      progress.setAttribute('aria-hidden', 'true');
      document.body.appendChild(progress);

      var rafId = null;
      var docEl = document.documentElement;

      var updateProgress = function () {
        rafId = null;
        var scrollTop = window.pageYOffset || docEl.scrollTop || 0;
        var scrollHeight = Math.max(
          docEl.scrollHeight - window.innerHeight,
          1
        );
        var ratio = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
        progress.style.transform = 'scaleX(' + ratio + ')';
      };

      var onScrollProgress = function () {
        if (rafId === null) {
          rafId = window.requestAnimationFrame(updateProgress);
        }
      };

      window.addEventListener('scroll', onScrollProgress, { passive: true });
      window.addEventListener('resize', onScrollProgress, { passive: true });
      updateProgress();
    }

    /* ---------- 2. Navbar .is-scrolled ---------- */
    var navbar = document.getElementById('navbar');
    if (navbar) {
      var navTicking = false;
      var checkNav = function () {
        navTicking = false;
        var y = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (y > 20) navbar.classList.add('is-scrolled');
        else navbar.classList.remove('is-scrolled');
      };
      var onScrollNav = function () {
        if (!navTicking) {
          navTicking = true;
          window.requestAnimationFrame(checkNav);
        }
      };
      window.addEventListener('scroll', onScrollNav, { passive: true });
      checkNav();
    }

    /* ---------- 3. Service card cursor spotlight ---------- */
    var serviceCards = document.querySelectorAll('#capabilities .service-card');
    if (serviceCards.length) {
      serviceCards.forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          var x = ((e.clientX - r.left) / r.width) * 100;
          var y = ((e.clientY - r.top) / r.height) * 100;
          card.style.setProperty('--mx', x.toFixed(2) + '%');
          card.style.setProperty('--my', y.toFixed(2) + '%');
        }, { passive: true });

        card.addEventListener('pointerleave', function () {
          card.style.setProperty('--mx', '50%');
          card.style.setProperty('--my', '50%');
        }, { passive: true });
      });
    }
  } catch (err) {
    /* Silent — do not break the site */
    if (window.console && console.warn) {
      console.warn('[enhance.js] disabled:', err && err.message);
    }
  }
})();

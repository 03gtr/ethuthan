/* ═══════════════════════════════════════════════════════════════
   ETHUTHAN — Cinematic Digital Business Card
   Touch parallax, asset preloading, reduced-motion support
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────── ASSET PRELOADING ─────────────── */
  function preloadAssets() {
    return new Promise(function (resolve) {
      var heroImg = new Image();
      heroImg.src = 'assets/hero.webp';
      if (heroImg.complete) {
        resolve();
        return;
      }
      heroImg.onload = resolve;
      heroImg.onerror = resolve;
      // Fallback timeout
      setTimeout(resolve, 3000);
    });
  }

  /* ─────────────── TOUCH PARALLAX ─────────────── */
  function initParallax() {
    var heroCamera = document.querySelector('.hero-camera');
    if (!heroCamera) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    var touchStartX = 0;
    var touchStartY = 0;
    var currentX = 0;
    var currentY = 0;
    var targetX = 0;
    var targetY = 0;
    var rafId = null;

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function animate() {
      currentX = lerp(currentX, targetX, 0.05);
      currentY = lerp(currentY, targetY, 0.05);

      heroCamera.style.transform = 'scale(1.07) translate(' + currentX + 'px, ' + currentY + 'px)';

      if (Math.abs(currentX - targetX) > 0.01 || Math.abs(currentY - targetY) > 0.01) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    }

    function startAnimation() {
      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    }

    document.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      var deltaX = (e.touches[0].clientX - touchStartX) / 50;
      var deltaY = (e.touches[0].clientY - touchStartY) / 50;
      targetX = Math.max(-8, Math.min(8, deltaX));
      targetY = Math.max(-5, Math.min(5, deltaY));
      startAnimation();
    }, { passive: true });

    document.addEventListener('touchend', function () {
      targetX = 0;
      targetY = 0;
      startAnimation();
    }, { passive: true });
  }

  /* ─────────────── MOUSE PARALLAX (Desktop) ─────────────── */
  function initMouseParallax() {
    var heroCamera = document.querySelector('.hero-camera');
    if (!heroCamera) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    var currentX = 0;
    var currentY = 0;
    var targetX = 0;
    var targetY = 0;
    var rafId = null;

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function animate() {
      currentX = lerp(currentX, targetX, 0.03);
      currentY = lerp(currentY, targetY, 0.03);

      heroCamera.style.transform = 'scale(1.07) translate(' + currentX + 'px, ' + currentY + 'px)';

      if (Math.abs(currentX - targetX) > 0.01 || Math.abs(currentY - targetY) > 0.01) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    }

    document.addEventListener('mousemove', function (e) {
      var rect = heroCamera.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    });
  }

  /* ─────────────── INIT ─────────────── */
  function init() {
    preloadAssets().then(function () {
      // Assets loaded — the CSS animation timeline handles the rest
    });

    initParallax();
    initMouseParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

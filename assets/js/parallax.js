/**
 * Lastmile Logi Solutions — Hero parallax module
 * Subtle translateY on warehouse background (desktop only)
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 767px)').matches;

  if (prefersReducedMotion || isMobile) return;

  var heroBg = document.querySelector('.parallax-bg');
  var heroSection = document.querySelector('.hero--warehouse');

  if (!heroBg || !heroSection) return;

  var maxOffset = 40;
  var ticking = false;

  function updateParallax() {
    var rect = heroSection.getBoundingClientRect();
    var heroHeight = heroSection.offsetHeight;

    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      var progress = Math.min(Math.max(-rect.top / heroHeight, 0), 1);
      var offset = progress * maxOffset;
      heroBg.style.transform = 'translate3d(0, ' + offset + 'px, 0) scale(1.05)';
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
})();

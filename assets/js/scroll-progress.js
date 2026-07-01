/**
 * Lastmile Logi Solutions — Scroll progress indicator
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar = document.querySelector('.scroll-progress');

  if (!bar || prefersReducedMotion) {
    if (bar) bar.remove();
    return;
  }

  var ticking = false;

  function updateProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    bar.style.transform = 'scaleX(' + (progress / 100) + ')';
    bar.setAttribute('aria-valuenow', String(Math.round(progress)));
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
})();

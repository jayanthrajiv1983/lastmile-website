/**
 * Lastmile Logi Solutions — Page loader
 * Minimal splash with logo + progress bar, integrates page fade-in
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var loader = document.getElementById('page-loader');
  var pageContent = document.querySelector('.page-content');

  function revealContent() {
    if (pageContent && !prefersReducedMotion) {
      pageContent.classList.add('page-content--entered');
    }
  }

  if (!loader || prefersReducedMotion) {
    if (loader) loader.remove();
    document.body.classList.remove('is-loading');
    revealContent();
    return;
  }

  document.body.classList.add('is-loading');
  var startTime = Date.now();
  var minDuration = 600;
  var maxDuration = 800;

  function dismissLoader() {
    var elapsed = Date.now() - startTime;
    var remaining = Math.max(0, minDuration - elapsed);
    var timeout = Math.min(remaining, maxDuration - elapsed);

    setTimeout(function () {
      loader.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
      revealContent();

      loader.addEventListener('transitionend', function () {
        loader.remove();
      }, { once: true });

      setTimeout(function () {
        if (loader.parentNode) loader.remove();
      }, 600);
    }, timeout);
  }

  if (document.readyState === 'complete') {
    dismissLoader();
  } else {
    window.addEventListener('load', dismissLoader);
    setTimeout(dismissLoader, maxDuration);
  }
})();

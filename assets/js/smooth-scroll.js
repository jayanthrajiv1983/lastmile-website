/**
 * Lastmile Logi Solutions — Smooth scroll module
 * Anchor navigation with sticky header offset
 */
(function () {
  'use strict';

  var HEADER_OFFSET = 96;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.style.scrollPaddingTop = HEADER_OFFSET + 'px';

  function normalizePage(path) {
    if (!path || path === '/' || path === './') return 'index.html';
    var name = path.split('/').filter(Boolean).pop();
    if (!name || name === 'index.html') return 'index.html';
    if (/\.html$/i.test(name)) return name;
    return name + '.html';
  }

  function scrollToTarget(target) {
    var rect = target.getBoundingClientRect();
    var top = window.pageYOffset + rect.top - HEADER_OFFSET;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }

  document.querySelectorAll('a[href*="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      var hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      var path = href.slice(0, hashIndex);
      if (!path || path === './') path = '';
      var linkPage = normalizePage(path);
      var currentPage = normalizePage(window.location.pathname);

      if (linkPage !== currentPage) return;
      var hash = href.slice(hashIndex);
      var target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      scrollToTarget(target);

      if (history.pushState) {
        history.pushState(null, '', hash);
      }
    });
  });
})();

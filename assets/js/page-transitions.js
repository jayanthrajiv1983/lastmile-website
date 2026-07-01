/**
 * Lastmile Logi Solutions — Page transition module
 * Fade-out on internal navigation, fade-in on load
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pageContent = document.querySelector('.page-content');
  var NAV_KEY = 'lls-internal-nav';

  function normalizePage(path) {
    if (!path || path === '/' || path === './') return 'index.html';
    var name = path.split('/').pop();
    return name || 'index.html';
  }

  function isInternalLink(link) {
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return false;
    }
    if (link.target === '_blank' || link.hasAttribute('download')) return false;

    try {
      var url = new URL(href, window.location.href);
      return url.origin === window.location.origin && /\.html$/i.test(url.pathname);
    } catch (e) {
      return /\.html$/i.test(href);
    }
  }

  function initEnterAnimation() {
    if (!pageContent || prefersReducedMotion) return;

    var isInternal = sessionStorage.getItem(NAV_KEY) === '1';
    sessionStorage.removeItem(NAV_KEY);

    if (isInternal) {
      pageContent.classList.add('page-content--enter');
    }
  }

  document.querySelectorAll('a[href]').forEach(function (link) {
    if (!isInternalLink(link)) return;

    link.addEventListener('click', function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (prefersReducedMotion || !pageContent) return;

      try {
        var url = new URL(link.href, window.location.href);
        if (normalizePage(url.pathname) === normalizePage(window.location.pathname)) return;
      } catch (e) {
        return;
      }

      event.preventDefault();
      var destination = link.href;

      pageContent.classList.add('page-content--exit');
      sessionStorage.setItem(NAV_KEY, '1');

      setTimeout(function () {
        window.location.href = destination;
      }, 150);
    });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnterAnimation);
  } else {
    initEnterAnimation();
  }
})();

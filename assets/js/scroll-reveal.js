/**
 * Lastmile Logi Solutions — Scroll reveal module
 * Intersection Observer with blur, slide, and configurable stagger
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealElements = document.querySelectorAll('.reveal, .reveal-blur, .reveal-left, .reveal-right, .reveal-scale');

  if (!revealElements.length) return;

  var STAGGER_DEFAULTS = {
    'reveal-stagger': 80,
    'reveal-stagger-services': 100,
    'reveal-stagger-testimonials': 120,
    'reveal-stagger-process': 100,
    'reveal-stagger-faq': 60
  };

  function applyStaggerDelays() {
    Object.keys(STAGGER_DEFAULTS).forEach(function (groupClass) {
      document.querySelectorAll('.' + groupClass).forEach(function (group) {
        var stagger = parseInt(group.getAttribute('data-stagger'), 10);
        if (isNaN(stagger)) stagger = STAGGER_DEFAULTS[groupClass];

        group.querySelectorAll(':scope > .reveal, :scope > .reveal-blur, :scope > .reveal-left, :scope > .reveal-right, :scope > .reveal-scale').forEach(function (el, index) {
          el.style.transitionDelay = (index * stagger) + 'ms';
        });
      });
    });
  }

  applyStaggerDelays();

  function showAllReveals() {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    showAllReveals();
    return;
  }

  try {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            el.classList.add('is-visible');
            el.style.willChange = 'transform, opacity';

            el.addEventListener('transitionend', function onEnd(event) {
              if (event.target === el && (event.propertyName === 'transform' || event.propertyName === 'opacity')) {
                el.style.willChange = '';
                el.removeEventListener('transitionend', onEnd);
              }
            });

            revealObserver.unobserve(el);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: [0, 0.12, 0.2] }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } catch (err) {
    showAllReveals();
  }

  document.querySelectorAll('.section-header.reveal, .section-header .reveal').forEach(function (header) {
    var divider = header.querySelector('.section-divider') || header.parentElement && header.parentElement.querySelector('.section-divider');
    if (divider && header.classList.contains('is-visible')) {
      divider.classList.add('is-visible');
    }
  });
})();

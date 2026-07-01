/**
 * Lastmile Logi Solutions — Animations module
 * Count-up stats, gradient sections, FAQ accordion
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function parseCounterValue(el) {
    var countAttr = el.getAttribute('data-counter') || el.getAttribute('data-count');
    if (!countAttr) return null;

    var target = parseFloat(countAttr);
    if (isNaN(target)) return null;

    var suffix = el.getAttribute('data-counter-suffix') || el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-counter-prefix') || el.getAttribute('data-prefix') || '';
    var decimals = parseInt(el.getAttribute('data-counter-decimals'), 10);
    if (isNaN(decimals)) decimals = countAttr.indexOf('.') > -1 ? 1 : 0;

    return { target: target, suffix: suffix, prefix: prefix, decimals: decimals };
  }

  function formatNumber(value, decimals) {
    if (decimals > 0) return value.toFixed(decimals);
    return String(Math.floor(value));
  }

  function animateCount(el, config) {
    var duration = prefersReducedMotion ? 0 : 2000;
    var startTime = null;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = easeOutExpo(progress);
      var current = config.target * eased;

      el.textContent = config.prefix + formatNumber(current, config.decimals) + config.suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = config.prefix + formatNumber(config.target, config.decimals) + config.suffix;
        el.style.willChange = '';
      }
    }

    if (duration === 0) {
      el.textContent = config.prefix + formatNumber(config.target, config.decimals) + config.suffix;
      return;
    }

    el.style.willChange = 'contents';
    requestAnimationFrame(step);
  }

  var counterElements = document.querySelectorAll('[data-counter], [data-count]');
  if (counterElements.length) {
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      var statsObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var config = parseCounterValue(entry.target);
              if (config) animateCount(entry.target, config);
              statsObserver.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: '0px', threshold: 0.3 }
      );

      counterElements.forEach(function (el) {
        statsObserver.observe(el);
      });
    } else {
      counterElements.forEach(function (el) {
        var config = parseCounterValue(el);
        if (config) animateCount(el, config);
      });
    }
  }

  /* Gradient section reveal */
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var gradientObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-gradient-active');
            gradientObserver.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );

    document.querySelectorAll('.section-gradient-animate, .cta-banner-inner, .cta-inner').forEach(function (el) {
      gradientObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.section-gradient-animate, .cta-banner-inner, .cta-inner').forEach(function (el) {
      el.classList.add('is-gradient-active');
    });
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-accordion-item').forEach(function (item) {
    var trigger = item.querySelector('.faq-accordion-trigger');
    var panel = item.querySelector('.faq-accordion-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      item.parentElement.querySelectorAll('.faq-accordion-item.is-open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          var openTrigger = openItem.querySelector('.faq-accordion-trigger');
          var openPanel = openItem.querySelector('.faq-accordion-panel');
          if (openTrigger) openTrigger.setAttribute('aria-expanded', 'false');
          if (openPanel) openPanel.hidden = true;
        }
      });

      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  });
})();

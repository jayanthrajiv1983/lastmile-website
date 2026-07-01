/**
 * Lastmile Logi Solutions — Timeline animation
 * Vertical line draw + dot pop + year slide
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timeline = document.querySelector('.timeline');

  if (!timeline) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    timeline.classList.add('is-drawn');
    timeline.querySelectorAll('.timeline-item').forEach(function (item) {
      item.classList.add('is-visible');
    });
    return;
  }

  var lineObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          timeline.classList.add('is-drawn');
          lineObserver.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -15% 0px', threshold: 0.15 }
  );

  lineObserver.observe(timeline);

  var itemObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          itemObserver.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.35 }
  );

  timeline.querySelectorAll('.timeline-item').forEach(function (item) {
    itemObserver.observe(item);
  });
})();

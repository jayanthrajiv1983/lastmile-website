/**
 * Lastmile Logi Solutions — Process flow animation
 * Connector line draw + step number scale-in
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var processFlow = document.querySelector('.process-flow');

  if (!processFlow) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    processFlow.classList.add('is-animated');
    processFlow.querySelectorAll('.process-step').forEach(function (step) {
      step.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          processFlow.classList.add('is-animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.2 }
  );

  observer.observe(processFlow);

  var stepObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          stepObserver.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.3 }
  );

  processFlow.querySelectorAll('.process-step').forEach(function (step, index) {
    step.style.setProperty('--step-index', String(index));
    stepObserver.observe(step);
  });
})();

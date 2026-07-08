/**
 * Lastmile Logi Solutions — Gallery lightbox
 * Opens warehouse gallery images in a full-screen viewer with navigation.
 */
(function () {
  'use strict';

  function init() {
    var lightbox = document.getElementById('warehouse-lightbox');
    if (!lightbox) return;

    var imageEl = document.getElementById('warehouse-lightbox-image');
    var spinnerEl = document.getElementById('warehouse-lightbox-spinner');
    var captionEl = document.getElementById('warehouse-lightbox-caption');
    var counterEl = document.getElementById('warehouse-lightbox-counter');
    var closeBtn = lightbox.querySelector('.warehouse-lightbox-close');
    var prevBtn = lightbox.querySelector('.warehouse-lightbox-prev');
    var nextBtn = lightbox.querySelector('.warehouse-lightbox-next');
    var triggers = Array.prototype.slice.call(document.querySelectorAll('.warehouse-action-trigger'));

    if (!imageEl || !closeBtn || !prevBtn || !nextBtn || !triggers.length) return;

    var currentIndex = 0;
    var touchStartX = 0;
    var touchStartY = 0;
    var lastFocused = null;

    var items = triggers.map(function (trigger) {
      var img = trigger.querySelector('img');
      return {
        src: img ? (img.currentSrc || img.getAttribute('src') || '') : '',
        alt: img ? img.getAttribute('alt') : '',
        caption: trigger.getAttribute('data-caption') || ''
      };
    });

    function markImageLoaded() {
      if (spinnerEl) spinnerEl.classList.remove('is-visible');
      imageEl.classList.add('is-loaded');
    }

    function render(index) {
      var item = items[index];
      if (!item || !item.src) return;

      if (spinnerEl) spinnerEl.classList.add('is-visible');
      imageEl.classList.remove('is-loaded');

      /* Bust cache when re-opening the same image so load handlers still run */
      if (imageEl.getAttribute('src') === item.src) {
        imageEl.removeAttribute('src');
      }

      imageEl.src = item.src;
      imageEl.alt = item.alt || 'Warehouse image';

      if (captionEl) captionEl.textContent = item.caption || '';
      if (counterEl) counterEl.textContent = (index + 1) + ' of ' + items.length;

      preloadAdjacent(index);

      /* Cached images may not fire load — check complete immediately */
      if (imageEl.complete && imageEl.naturalWidth > 0) {
        markImageLoaded();
      }
    }

    function open(index) {
      lastFocused = document.activeElement;
      currentIndex = index;
      render(currentIndex);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      imageEl.removeAttribute('src');
      imageEl.alt = '';
      imageEl.classList.remove('is-loaded');
      if (spinnerEl) spinnerEl.classList.remove('is-visible');
      if (captionEl) captionEl.textContent = '';
      if (counterEl) counterEl.textContent = '';
      document.body.classList.remove('lightbox-open');
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    function step(delta) {
      currentIndex = (currentIndex + delta + items.length) % items.length;
      render(currentIndex);
    }

    function preload(index) {
      var item = items[index];
      if (!item || !item.src) return;
      var preloadImg = new Image();
      preloadImg.src = item.src;
    }

    function preloadAdjacent(index) {
      preload((index + 1) % items.length);
      preload((index - 1 + items.length) % items.length);
    }

    function isInteractiveTarget(target) {
      return target.closest('.warehouse-lightbox-figure') ||
        target.closest('.warehouse-lightbox-nav') ||
        target.closest('.warehouse-lightbox-close');
    }

    imageEl.addEventListener('load', markImageLoaded);

    imageEl.addEventListener('error', function () {
      if (spinnerEl) spinnerEl.classList.remove('is-visible');
    });

    triggers.forEach(function (trigger, index) {
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        open(index);
      });
    });

    prevBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      step(-1);
    });

    nextBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      step(1);
    });

    closeBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      close();
    });

    lightbox.addEventListener('click', function (event) {
      if (!isInteractiveTarget(event.target)) {
        close();
      }
    });

    lightbox.addEventListener('touchstart', function (event) {
      if (!event.touches || !event.touches.length) return;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (event) {
      if (!event.changedTouches || !event.changedTouches.length) return;
      var dx = event.changedTouches[0].clientX - touchStartX;
      var dy = event.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        step(dx < 0 ? 1 : -1);
      }
    }, { passive: true });

    document.addEventListener('keydown', function (event) {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

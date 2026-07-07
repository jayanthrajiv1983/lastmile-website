(function () {
  'use strict';

  var lightbox = document.getElementById('warehouse-lightbox');
  if (!lightbox) return;

  var imageEl = document.getElementById('warehouse-lightbox-image');
  var closeBtn = lightbox.querySelector('.warehouse-lightbox-close');
  var prevBtn = lightbox.querySelector('.warehouse-lightbox-prev');
  var nextBtn = lightbox.querySelector('.warehouse-lightbox-next');
  var triggers = Array.prototype.slice.call(document.querySelectorAll('.warehouse-action-trigger'));

  if (!imageEl || !triggers.length) return;

  var currentIndex = 0;
  var items = triggers.map(function (trigger) {
    var img = trigger.querySelector('img');
    return {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : ''
    };
  });

  function render(index) {
    var item = items[index];
    if (!item) return;
    imageEl.src = item.src;
    imageEl.alt = item.alt || 'Warehouse image';
  }

  function open(index) {
    currentIndex = index;
    render(currentIndex);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    imageEl.src = '';
    imageEl.alt = '';
    document.body.style.overflow = '';
  }

  function step(delta) {
    currentIndex = (currentIndex + delta + items.length) % items.length;
    render(currentIndex);
  }

  triggers.forEach(function (trigger, index) {
    trigger.addEventListener('click', function () {
      open(index);
    });
  });

  prevBtn.addEventListener('click', function () {
    step(-1);
  });

  nextBtn.addEventListener('click', function () {
    step(1);
  });

  closeBtn.addEventListener('click', close);

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) close();
  });

  document.addEventListener('keydown', function (event) {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
  });
})();

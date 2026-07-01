/**
 * Lastmile Logi Solutions — Navigation module
 * Sticky header, mobile menu, services dropdown
 */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');
  var dropdown = document.querySelector('.nav-dropdown');
  var dropdownToggle = document.querySelector('.nav-dropdown-toggle');
  var scrollThreshold = 80;

  /* Sticky header glass effect on scroll */
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > scrollThreshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile nav toggle */
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      siteNav.classList.toggle('is-open');
    });

    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('is-open');
        if (dropdown) dropdown.classList.remove('is-open');
      });
    });

    document.addEventListener('click', function (event) {
      if (
        siteNav.classList.contains('is-open') &&
        !siteNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('is-open');
      }
    });
  }

  /* Services dropdown — mobile accordion only; desktop uses CSS :hover */
  if (dropdown && dropdownToggle) {
    var desktopDropdownQuery = window.matchMedia('(min-width: 768px)');

    var closeDropdown = function () {
      dropdown.classList.remove('is-open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    };

    var openDropdown = function () {
      dropdown.classList.add('is-open');
      dropdownToggle.setAttribute('aria-expanded', 'true');
    };

    closeDropdown();

    dropdownToggle.addEventListener('click', function (event) {
      event.stopPropagation();
      if (desktopDropdownQuery.matches) {
        return;
      }
      if (dropdown.classList.contains('is-open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    document.addEventListener('click', function (event) {
      if (!desktopDropdownQuery.matches && !dropdown.contains(event.target)) {
        closeDropdown();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    });

    desktopDropdownQuery.addEventListener('change', function () {
      closeDropdown();
    });
  }

  /* Active nav state per page */
  var currentPath = window.location.pathname;
  var currentPage = currentPath.split('/').pop() || 'index.html';
  if (!currentPage || currentPage === '' || !/\.html$/i.test(currentPage)) {
    currentPage = 'index.html';
  }

  document.querySelectorAll('.site-nav a[href]').forEach(function (link) {
    var href = link.getAttribute('href').split('#')[0];
    if (!href || href === './') href = 'index.html';
    if (href === currentPage || (currentPage === 'index.html' && (href === 'index.html' || href === ''))) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  if (currentPage === 'index.html') {
    var homeLogo = document.querySelector('.logo-link');
    if (homeLogo) homeLogo.setAttribute('aria-current', 'page');
  }

  if (currentPage === 'services.html') {
    var servicesToggle = document.querySelector('.nav-dropdown-toggle');
    if (servicesToggle) {
      servicesToggle.classList.add('is-active');
      servicesToggle.setAttribute('aria-current', 'page');
    }
  }

  /* Footer year */
  var footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }
})();

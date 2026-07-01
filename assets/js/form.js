/**
 * Lastmile Logi Solutions — Contact form validation
 * Client-side only with success state
 */
(function () {
  'use strict';

  var form = document.getElementById('quote-form-fields');
  if (!form) return;

  var successEl = document.getElementById('form-success');
  var statusEl = document.getElementById('form-status');
  var fields = {
    name: { el: document.getElementById('name'), required: true },
    email: { el: document.getElementById('email'), required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { el: document.getElementById('phone'), required: true, pattern: /^[\d\s+\-()]{10,}$/ },
    company: { el: document.getElementById('company'), required: true },
    service: { el: document.getElementById('service'), required: true },
    message: { el: document.getElementById('message'), required: true },
    consent: { el: document.getElementById('consent'), required: true, checkbox: true }
  };

  function announceStatus(message) {
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  function showError(fieldKey, message) {
    var field = fields[fieldKey];
    if (!field || !field.el) return;

    field.el.classList.add('is-invalid');
    field.el.setAttribute('aria-invalid', 'true');

    var existing = field.el.parentElement.querySelector('.form-error');
    if (existing) existing.remove();

    var error = document.createElement('span');
    error.className = 'form-error';
    error.id = fieldKey + '-error';
    error.textContent = message;
    field.el.setAttribute('aria-describedby', error.id);
    field.el.parentElement.appendChild(error);
  }

  function clearErrors() {
    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      if (!field || !field.el) return;
      field.el.classList.remove('is-invalid');
      field.el.removeAttribute('aria-invalid');
      field.el.removeAttribute('aria-describedby');
      var error = field.el.parentElement.querySelector('.form-error');
      if (error) error.remove();
    });
  }

  function validate() {
    clearErrors();
    var isValid = true;

    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      if (!field || !field.el) return;

      var value = field.checkbox ? field.el.checked : field.el.value.trim();

      if (field.required && !value) {
        showError(key, 'This field is required.');
        isValid = false;
        return;
      }

      if (field.pattern && value && !field.pattern.test(value)) {
        var msg = key === 'email' ? 'Please enter a valid email address.' :
                  key === 'phone' ? 'Please enter a valid phone number.' : 'Invalid value.';
        showError(key, msg);
        isValid = false;
      }
    });

    return isValid;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validate()) {
      var firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      announceStatus('Please correct the errors below before submitting.');
      return;
    }

    announceStatus('Quote request submitted successfully.');

    form.hidden = true;
    if (successEl) {
      successEl.hidden = false;
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    if (!field || !field.el) return;

    field.el.addEventListener('input', function () {
      field.el.classList.remove('is-invalid');
      field.el.removeAttribute('aria-invalid');
      var error = field.el.parentElement.querySelector('.form-error');
      if (error) error.remove();
    });
  });
})();

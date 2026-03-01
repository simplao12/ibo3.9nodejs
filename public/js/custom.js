/**
 * custom.js — misc UI helpers
 */
(function () {
  'use strict';

  // Debounce utility
  window.debounce = function (fn, delay) {
    var timer;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
    };
  };

  // Debounced search — auto-submit form when typing stops
  function initDebounceSearch() {
    var searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    var form = searchInput.closest('form') || document.getElementById('searchForm');
    if (!form) return;
    searchInput.addEventListener('input', window.debounce(function () { form.submit(); }, 400));
  }

  // Auto-dismiss alerts
  function initAutoDismiss() {
    document.querySelectorAll('.alert-dismissible[data-auto-dismiss]').forEach(function (el) {
      var delay = parseInt(el.getAttribute('data-auto-dismiss'), 10) || 5000;
      setTimeout(function () {
        var bsAlert = bootstrap.Alert.getOrCreateInstance(el);
        if (bsAlert) bsAlert.close();
      }, delay);
    });
  }

  function init() {
    initDebounceSearch();
    initAutoDismiss();
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();

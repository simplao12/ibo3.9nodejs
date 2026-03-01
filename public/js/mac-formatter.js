/**
 * mac-formatter.js — Auto-formats MAC address inputs (xx:xx:xx:xx:xx:xx)
 *
 * Apply to any input with data-mac="true" or class="mac-input"
 */
(function () {
  'use strict';

  function formatMac(value) {
    // Strip everything that's not hex
    var hex = value.replace(/[^0-9a-fA-F]/g, '');
    // Group into pairs, join with colons, max 6 pairs (12 hex chars)
    var pairs = hex.match(/.{1,2}/g) || [];
    if (pairs.length > 6) pairs = pairs.slice(0, 6);
    return pairs.join(':').toUpperCase();
  }

  function init() {
    var inputs = document.querySelectorAll('[data-mac="true"], .mac-input');

    inputs.forEach(function (input) {
      // Format on paste
      input.addEventListener('paste', function (e) {
        e.preventDefault();
        var pasted = (e.clipboardData || window.clipboardData).getData('text');
        input.value = formatMac(pasted);
      });

      // Format on input (typing)
      input.addEventListener('input', function () {
        var pos = input.selectionStart;
        var prev = input.value;
        var formatted = formatMac(prev);
        input.value = formatted;

        // Adjust cursor: keep it after the colon groups
        if (formatted.length > prev.length) {
          input.setSelectionRange(pos + 1, pos + 1);
        } else {
          input.setSelectionRange(pos, pos);
        }
      });

      // Validate on blur
      input.addEventListener('blur', function () {
        var val = input.value.trim();
        if (!val) return;
        var valid = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(val);
        input.classList.toggle('is-invalid', !valid);
        input.classList.toggle('is-valid', valid);

        // Show custom error
        var feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
          feedback.textContent = valid ? '' : 'Invalid MAC address format (XX:XX:XX:XX:XX:XX)';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

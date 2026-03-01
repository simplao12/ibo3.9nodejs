/**
 * toast.js — Auto-show Bootstrap 5 toast notifications
 * Reads flash messages rendered in the DOM and displays them.
 */
(function () {
  'use strict';

  function initToasts() {
    const toastEl = document.getElementById('liveToast');
    if (!toastEl) return;

    const messages = window.__flashMessages || [];
    if (!messages.length) return;

    // Use last message for the single toast element
    const last = messages[messages.length - 1];
    const toastBody = toastEl.querySelector('.toast-body');
    const toastHeader = toastEl.querySelector('.toast-header strong');

    if (toastBody) toastBody.textContent = last.message;
    if (toastHeader) toastHeader.textContent = last.type === 'error' ? 'Error' : last.type === 'warning' ? 'Warning' : 'Notice';

    // Color the toast based on type
    toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'text-white');
    switch (last.type) {
      case 'success':
        toastEl.classList.add('bg-success', 'text-white');
        break;
      case 'error':
        toastEl.classList.add('bg-danger', 'text-white');
        break;
      case 'warning':
        toastEl.classList.add('bg-warning');
        break;
      default:
        toastEl.classList.add('bg-info', 'text-white');
    }

    const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
    toast.show();

    // If there are multiple messages, show them in sequence
    if (messages.length > 1) {
      let i = 0;
      const showNext = function () {
        if (i >= messages.length) return;
        const msg = messages[i++];
        if (toastBody) toastBody.textContent = msg.message;

        toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'text-white');
        switch (msg.type) {
          case 'success': toastEl.classList.add('bg-success', 'text-white'); break;
          case 'error':   toastEl.classList.add('bg-danger', 'text-white'); break;
          case 'warning': toastEl.classList.add('bg-warning'); break;
          default:        toastEl.classList.add('bg-info', 'text-white');
        }

        const t = new bootstrap.Toast(toastEl, { delay: 4000 });
        t.show();
        toastEl.addEventListener('hidden.bs.toast', showNext, { once: true });
      };

      toastEl.addEventListener('hidden.bs.toast', showNext, { once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToasts);
  } else {
    initToasts();
  }
})();

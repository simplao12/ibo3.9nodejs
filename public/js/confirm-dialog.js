/**
 * confirm-dialog.js — AJAX delete with Bootstrap 5 confirm modal
 *
 * Usage:
 *   <button class="btn-delete"
 *           data-url="/dns/5/delete"
 *           data-label="DNS entry 'Google'"
 *           data-csrf="<%= csrfToken %>">
 *     Delete
 *   </button>
 */
(function () {
  'use strict';

  var pendingUrl   = null;
  var pendingCsrf  = null;
  var pendingRow   = null;

  function getCsrfFromMeta() {
    var m = document.querySelector('meta[name="csrf-token"]');
    return m ? m.getAttribute('content') : '';
  }

  function init() {
    var modal = document.getElementById('confirmDeleteModal');
    if (!modal) return;

    var labelEl = document.getElementById('confirmDeleteLabel');
    var confirmBtn = document.getElementById('confirmDeleteBtn');

    // Delegate click to all .btn-delete buttons
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-delete');
      if (!btn) return;

      e.preventDefault();

      pendingUrl  = btn.getAttribute('data-url');
      pendingCsrf = btn.getAttribute('data-csrf') || getCsrfFromMeta();
      pendingRow  = btn.closest('tr');

      var label = btn.getAttribute('data-label') || 'this item';
      if (labelEl) labelEl.textContent = label;

      var bsModal = bootstrap.Modal.getOrCreateInstance(modal);
      bsModal.show();
    });

    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        if (!pendingUrl) return;

        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Deleting…';

        fetch(pendingUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: '_csrf=' + encodeURIComponent(pendingCsrf) + '&_method=DELETE'
        })
          .then(function (res) {
            if (!res.ok) throw new Error('Server error ' + res.status);
            return res.json();
          })
          .then(function (data) {
            var bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) bsModal.hide();

            if (pendingRow) {
              pendingRow.style.transition = 'opacity 0.3s';
              pendingRow.style.opacity = '0';
              setTimeout(function () {
                pendingRow.remove();
                updateRowCount();
              }, 300);
            }

            showInlineToast(data.message || 'Deleted successfully.', 'success');
          })
          .catch(function (err) {
            showInlineToast('Delete failed: ' + err.message, 'error');
          })
          .finally(function () {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Delete';
            pendingUrl = pendingCsrf = pendingRow = null;
          });
      });
    }
  }

  function updateRowCount() {
    var tbody = document.querySelector('table tbody');
    if (!tbody) return;
    var rows = tbody.querySelectorAll('tr');
    var badge = document.getElementById('rowCount');
    if (badge) badge.textContent = rows.length;
    if (rows.length === 0) {
      var cols = document.querySelectorAll('table thead th').length || 4;
      tbody.innerHTML = '<tr><td colspan="' + cols + '" class="text-center text-muted py-4">No records found.</td></tr>';
    }
  }

  function showInlineToast(message, type) {
    var toastEl = document.getElementById('liveToast');
    if (!toastEl) return;

    var toastBody = toastEl.querySelector('.toast-body');
    if (toastBody) toastBody.textContent = message;

    toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'text-white');
    if (type === 'success') {
      toastEl.classList.add('bg-success', 'text-white');
    } else if (type === 'error') {
      toastEl.classList.add('bg-danger', 'text-white');
    } else {
      toastEl.classList.add('bg-info', 'text-white');
    }

    var t = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4000 });
    t.show();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

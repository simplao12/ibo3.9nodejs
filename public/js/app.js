/**
 * app.js — Form spinners, Bootstrap 5 validation, sidebar toggle
 */
(function () {
  'use strict';

  /* ── Sidebar ─────────────────────────────────────────────────────── */
  function initSidebar() {
    var toggleBtn = document.getElementById('menu-toggle');
    var closeBtn  = document.getElementById('sidebar-close');
    var overlay   = document.getElementById('sidebar-overlay');
    var wrapper   = document.getElementById('wrapper');
    if (!wrapper) return;

    function isMobile() { return window.innerWidth < 992; }

    function openSidebar()  { wrapper.classList.add('sidebar-open'); }
    function closeSidebar() { wrapper.classList.remove('sidebar-open'); }

    function toggleDesktop() {
      wrapper.classList.toggle('toggled');
      try { localStorage.setItem('sidebarToggled', wrapper.classList.contains('toggled') ? '1' : '0'); } catch (_) {}
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        isMobile() ? (wrapper.classList.contains('sidebar-open') ? closeSidebar() : openSidebar()) : toggleDesktop();
      });
    }

    if (closeBtn)  closeBtn.addEventListener('click', closeSidebar);
    if (overlay)   overlay.addEventListener('click', closeSidebar);

    // Auto-close on nav link click (mobile)
    document.querySelectorAll('#sidebar-wrapper .list-group-item:not(.sidebar-dropdown-toggle)').forEach(function (link) {
      link.addEventListener('click', function () { if (isMobile()) closeSidebar(); });
    });

    // Restore desktop state
    try { if (!isMobile() && localStorage.getItem('sidebarToggled') === '1') wrapper.classList.add('toggled'); } catch (_) {}

    // Clean up on resize
    window.addEventListener('resize', function () { if (!isMobile()) closeSidebar(); });
  }

  /* ── Form spinners ───────────────────────────────────────────────── */
  function initFormSpinners() {
    document.querySelectorAll('form[data-loading]').forEach(function (form) {
      form.addEventListener('submit', function () {
        if (!form.checkValidity()) return;
        var btn = form.querySelector('[type="submit"]');
        if (!btn) return;
        var orig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>'
          + (btn.getAttribute('data-loading-text') || 'Saving…');
        setTimeout(function () { if (btn.disabled) { btn.disabled = false; btn.innerHTML = orig; } }, 8000);
      });
    });
  }

  /* ── Bootstrap 5 validation ──────────────────────────────────────── */
  function initBootstrapValidation() {
    document.querySelectorAll('form.needs-validation').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        if (!form.checkValidity()) { e.preventDefault(); e.stopPropagation(); }
        form.classList.add('was-validated');
      });
    });
  }

  /* ── Tooltips ────────────────────────────────────────────────────── */
  function initTooltips() {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) { new bootstrap.Tooltip(el); });
  }

  /* ── Copy buttons ────────────────────────────────────────────────── */
  function initCopyBtns() {
    document.querySelectorAll('.btn-copy').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = document.getElementById(btn.getAttribute('data-copy') || '');
        if (!input) return;
        navigator.clipboard.writeText(input.value || input.textContent).then(function () {
          var orig = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i>';
          setTimeout(function () { btn.innerHTML = orig; }, 1500);
        });
      });
    });
  }

  /* ── Password toggle ─────────────────────────────────────────────── */
  function initPasswordToggle() {
    document.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
      var input = document.getElementById(btn.getAttribute('data-toggle-password') || '');
      if (!input) return;
      btn.addEventListener('click', function () {
        var isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        var icon = btn.querySelector('i');
        if (icon) icon.className = isText ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
      });
    });
  }

  /* ── Init ────────────────────────────────────────────────────────── */
  function init() {
    initSidebar();
    initFormSpinners();
    initBootstrapValidation();
    initTooltips();
    initCopyBtns();
    initPasswordToggle();
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();

/*
  SUVIDHA SAINIK shared UI helpers (PS-11, CS Dte demonstrator).
  Vanilla JS, no dependencies. Markup uses the inherited house "aams-*"
  component classes from app.css/tokens.css — only namespace, nav, wordmark
  and status vocabulary are rebranded here. Exposes window.CSD.ui.
*/
(function () {
  'use strict';

  var NAV_ITEMS = [
    { page: 'index.html', label: 'Overview' },
    { page: 'beneficiary.html', label: 'My Canteen (INDL)' },
    { page: 'urc.html', label: 'URC Manager & Counter' },
    { page: 'samadhan.html', label: 'SAMADHAN Grievances' },
    { page: 'supply.html', label: 'Supply & Vendors' },
    { page: 'drishti.html', label: 'DRISHTI Command' },
    { page: 'audit.html', label: 'Audit Trail' },
    { page: 'walkthrough.html', label: 'Guided Walkthrough' }
  ];

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  // formatDate — 'YYYY-MM-DD', ISO timestamp, or Date → 'DD MMM YY'. '—' passes through.
  function formatDate(input) {
    if (!input || input === '—') return '—';
    var d = input instanceof Date ? input : new Date(String(input));
    if (isNaN(d.getTime())) return String(input);
    var isDateOnly = typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input);
    var day = isDateOnly ? d.getUTCDate() : d.getDate();
    var month = isDateOnly ? d.getUTCMonth() : d.getMonth();
    var year = isDateOnly ? d.getUTCFullYear() : d.getFullYear();
    return pad2(day) + ' ' + MONTHS[month] + ' ' + String(year).slice(-2);
  }
  function formatTime(iso) { return iso && iso.length > 10 ? iso.slice(11, 16) : ''; }

  // statusBadge — pill for any CSD status vocabulary. Reuses aams-badge modifiers.
  var STATUS = {
    'active': ['Active', 'vacant'], 'renewal-due': ['Renewal Due', 'reserved'], 'deceased-flag': ['Deceased Record', 'blocked'],
    'open': ['Open', 'vacant'], 'stock-critical': ['Stock Critical', 'blocked'], 'sync-overdue': ['Sync Overdue', 'reserved'], 'closed-today': ['Closed Today', 'maintenance'],
    'online': ['Online', 'vacant'], 'intermittent': ['Intermittent', 'reserved'], 'offline-sync': ['Offline · EOD Sync', 'maintenance'],
    'held': ['Held for Manager', 'reserved'], 'released': ['Released', 'vacant'], 'card-suspended': ['Card Suspended', 'blocked'], 'referred': ['Referred', 'occupied'],
    'verifying': ['Verifying', 'waiting'], 'ready': ['Ready', 'vacant'], 'completed': ['Completed', 'vacant'], 'declined': ['Declined', 'blocked'],
    'lodged': ['Lodged', 'waiting'], 'acknowledged': ['Acknowledged', 'occupied'], 'under-investigation': ['Under Investigation', 'reserved'], 'resolved': ['Resolved', 'vacant'],
    'within': ['Within SLA', 'vacant'], 'due': ['SLA Due', 'reserved'], 'breached': ['SLA Breached', 'blocked'], 'no-sla': ['No SLA', 'neutral'], 'closed': ['Closed', 'neutral'],
    'high': ['High', 'blocked'], 'medium': ['Medium', 'reserved'], 'low': ['Low', 'neutral'],
    'green': ['Green', 'vacant'], 'amber': ['Amber', 'reserved'], 'red': ['Red', 'blocked'],
    'clear': ['Clear', 'vacant'], 'stockout': ['Stockout Risk', 'blocked'], 'overstock': ['Overstock', 'reserved'], 'ok': ['Balanced', 'vacant'],
    'proposed': ['Proposed', 'waiting'], 'approved': ['Approved', 'vacant'], 'rejected': ['Rejected', 'blocked'],
    'dispatched': ['Dispatched', 'waiting'], 'in-transit': ['In Transit', 'occupied'], 'at-depot-gate': ['At Depot Gate', 'reserved'], 'received': ['Received', 'vacant'], 'delayed': ['Delayed', 'blocked']
  };
  function statusBadge(status) {
    var key = String(status || '').toLowerCase();
    var s = STATUS[key];
    return '<span class="aams-badge aams-badge--' + (s ? s[1] : 'neutral') + '">' + (s ? s[0] : escapeHtml(status)) + '</span>';
  }

  // tierBadge — URC tier 1/2/3 per concept paper §5.4
  function tierBadge(tier) {
    return '<span class="aams-badge aams-badge--' + (tier === 1 ? 'occupied' : tier === 2 ? 'waiting' : 'maintenance') + '">Tier ' + tier + '</span>';
  }

  // factorChip — F1/F2/F3 with state: 'passed' | 'pending' | 'deferred' | 'na'
  var FACTOR_LABEL = { F1: 'F1 Card scan', F2: 'F2 Mobile OTP', F3: 'F3 Aadhaar yes/no' };
  function factorChip(f, state) {
    var mod = state === 'passed' ? 'vacant' : state === 'deferred' ? 'maintenance' : state === 'pending' ? 'reserved' : 'neutral';
    var mark = state === 'passed' ? '✓ ' : state === 'deferred' ? '⏱ ' : '';
    return '<span class="aams-badge aams-badge--' + mod + '">' + mark + (FACTOR_LABEL[f] || f) + '</span>';
  }

  // evidenceList — the explainability contract, rendered. Every advisory shows WHY.
  function evidenceList(items, title) {
    if (!items || !items.length) return '';
    return '<div class="csd-evidence">' +
      '<div class="csd-evidence__title">' + escapeHtml(title || 'Why — stated evidence') + '</div>' +
      '<ul>' + items.map(function (e) { return '<li>' + escapeHtml(e) + '</li>'; }).join('') + '</ul></div>';
  }

  // meter — overall/balance entitlement bar (PS-11 "Overall / Balance")
  function meter(overall, balance, unitLabel) {
    var used = overall - balance;
    var pct = overall ? clamp(Math.round(used / overall * 100), 0, 100) : 0;
    var color = pct >= 90 ? 'var(--aams-alert)' : pct >= 70 ? 'var(--aams-amber)' : 'var(--aams-primary)';
    return '<div class="csd-meter" title="' + pct + '% used">' +
      '<div class="csd-meter__bar"><span style="width:' + pct + '%;background:' + color + '"></span></div>' +
      '<div class="csd-meter__label"><strong>' + escapeHtml(unitLabel === '₹' ? '₹' + Number(balance).toLocaleString('en-IN') : balance + ' ' + (unitLabel || '')) + '</strong> left of ' +
      escapeHtml(unitLabel === '₹' ? '₹' + Number(overall).toLocaleString('en-IN') : overall + ' ' + (unitLabel || '')) + '</div></div>';
  }

  // barcodeSvg — deterministic Code-128-looking bars from a string (visual only, not scannable).
  function barcodeSvg(code, width, height) {
    var w = width || 260, h = height || 64, x = 6, bars = '';
    var s = String(code);
    for (var i = 0; i < s.length * 4 && x < w - 8; i++) {
      var c = s.charCodeAt(i % s.length) + i * 7;
      var bw = 1 + (c % 3), gap = 1 + ((c >> 2) % 3);
      bars += '<rect x="' + x + '" y="4" width="' + bw + '" height="' + (h - 18) + '"/>';
      x += bw + gap;
    }
    return '<svg class="csd-barcode" viewBox="0 0 ' + w + ' ' + h + '" width="100%" height="' + h + '" role="img" aria-label="Barcode ' + escapeHtml(s) + '">' +
      '<rect width="' + w + '" height="' + h + '" fill="#fff"/><g fill="#1c2430">' + bars + '</g>' +
      '<text x="' + (w / 2) + '" y="' + (h - 3) + '" text-anchor="middle" font-family="Courier New, monospace" font-size="11" fill="#1c2430">' + escapeHtml(s) + '</text></svg>';
  }

  // demoBanner — one-line honesty strip for every page
  function demoBanner(text) {
    return '<div class="csd-demo-banner"><strong>DEMONSTRATOR</strong> · Fictional seeded data · ' +
      escapeHtml(text || 'Illustrative values, not CSD policy. Nothing leaves this browser.') + '</div>';
  }

  // auditToast — standard toast for an audit entry
  function auditToast(entry, prefix) {
    if (!entry) return;
    toast((prefix ? prefix + ' — ' : '') + 'Audit: ' + entry.action + ' · ' + entry.target + ' · by ' + entry.actor, 'success');
  }

  // -----------------------------------------------------------------------
  // renderTopbar — mounts the app topbar into #aams-topbar (or a given target).
  // -----------------------------------------------------------------------
  function renderTopbar(roleLabel, target) {
    var el = typeof target === 'string' ? document.querySelector(target) : (target || document.getElementById('aams-topbar'));
    if (!el) return;
    el.className = 'aams-topbar';
    el.innerHTML =
      '<button type="button" class="aams-topbar__menu-btn" id="aams-nav-toggle" aria-label="Toggle navigation">☰</button>' +
      '<div class="aams-topbar__brand">SUVIDHA SAINIK <small>&middot; Canteen Services Application &middot; PS-11</small></div>' +
      '<div class="aams-topbar__spacer"></div>' +
      (roleLabel ? '<div class="aams-topbar__role">' + escapeHtml(roleLabel) + '</div>' : '') +
      '<div class="aams-topbar__badge">Demonstrator &middot; Seeded Data</div>';

    var toggle = el.querySelector('#aams-nav-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var nav = document.getElementById('aams-nav');
        if (nav) nav.classList.toggle('is-open');
      });
    }
  }

  // -----------------------------------------------------------------------
  // renderNav — mounts the left-hand navigation into #aams-nav (or a given target).
  // -----------------------------------------------------------------------
  function renderNav(activePage, target) {
    var el = typeof target === 'string' ? document.querySelector(target) : (target || document.getElementById('aams-nav'));
    if (!el) return;
    el.className = 'aams-nav';
    var items = NAV_ITEMS.map(function (item) {
      var isActive = item.page === activePage;
      return '<li><a class="aams-nav__link' + (isActive ? ' is-active' : '') + '" href="' + item.page + '"' +
        (isActive ? ' aria-current="page"' : '') + '>' + item.label + '</a></li>';
    }).join('');
    el.innerHTML = '<ul class="aams-nav__list">' + items + '</ul>';
  }

  // -----------------------------------------------------------------------
  // Modal helpers — expects markup: <div class="aams-modal-overlay" id="...">…</div>
  // -----------------------------------------------------------------------
  function openModal(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  // Close on overlay click or Escape, once at load.
  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('aams-modal-overlay')) {
      e.target.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    if (e.target && e.target.closest && e.target.closest('[data-modal-close]')) {
      var overlay = e.target.closest('.aams-modal-overlay');
      if (overlay) { overlay.classList.remove('is-open'); document.body.style.overflow = ''; }
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.aams-modal-overlay.is-open').forEach(function (overlay) {
        overlay.classList.remove('is-open');
      });
      document.body.style.overflow = '';
    }
  });

  // -----------------------------------------------------------------------
  // toast — transient notification, mounted into #aams-toast-region.
  // -----------------------------------------------------------------------
  function toast(message, type) {
    var region = document.getElementById('aams-toast-region');
    if (!region) {
      region = document.createElement('div');
      region.id = 'aams-toast-region';
      region.className = 'aams-toast-region';
      document.body.appendChild(region);
    }
    var el = document.createElement('div');
    el.className = 'aams-toast aams-toast--' + (type || 'info');
    el.textContent = message;
    region.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-visible'); });
    setTimeout(function () {
      el.classList.remove('is-visible');
      setTimeout(function () { el.remove(); }, 250);
    }, 4000);
  }

  // -----------------------------------------------------------------------
  // initPage — convenience bootstrap for a page: mounts topbar + nav.
  // options: { role: 'Command Dashboard', activePage: 'command.html' }
  // -----------------------------------------------------------------------
  function initPage(options) {
    var opts = options || {};
    renderTopbar(opts.role, opts.topbarTarget);
    renderNav(opts.activePage, opts.navTarget);
  }

  window.CSD = window.CSD || {};
  window.CSD.ui = {
    NAV_ITEMS: NAV_ITEMS,
    renderTopbar: renderTopbar,
    renderNav: renderNav,
    formatDate: formatDate,
    formatTime: formatTime,
    statusBadge: statusBadge,
    tierBadge: tierBadge,
    factorChip: factorChip,
    evidenceList: evidenceList,
    meter: meter,
    barcodeSvg: barcodeSvg,
    demoBanner: demoBanner,
    auditToast: auditToast,
    openModal: openModal,
    closeModal: closeModal,
    toast: toast,
    initPage: initPage,
    escapeHtml: escapeHtml
  };
})();

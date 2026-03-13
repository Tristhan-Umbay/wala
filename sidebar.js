/**
 * sidebar.js — NNCHS Shared Sidebar Component
 * Include this script in any page to get the full sidebar.
 * Usage: <script src="sidebar.js" data-active="dashboard|usap|hero|vmv|services|fb|map"></script>
 */
(function () {
  const activeKey = document.currentScript
    ? (document.currentScript.getAttribute('data-active') || 'dashboard')
    : 'dashboard';

  /* ── INJECT CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    /* ── BODY SCROLL LOCK (iOS fix) ── */
    body.nnchs-locked {
      overflow: hidden !important;
      position: fixed !important;
      width: 100% !important;
      -webkit-overflow-scrolling: auto !important;
    }

    .nnchs-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.50); z-index: 90;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      /* prevent overlay itself from capturing scroll on iOS */
      touch-action: none;
      -webkit-tap-highlight-color: transparent;
    }
    .nnchs-overlay.open { display: block; }

    .nnchs-sidebar {
      position: fixed; left: 0; top: 0; bottom: 0; width: 240px;
      background: #1a2540; display: flex; flex-direction: column;
      z-index: 100; transform: translateX(-100%);
      transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
      box-shadow: 4px 0 24px rgba(0,0,0,0.18);
      font-family: 'Sora', sans-serif;
      /* iOS overscroll fix — prevent page from scrolling behind */
      overscroll-behavior: contain;
      /* Safe area support (notch/home bar on iOS) */
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }
    .nnchs-sidebar.open { transform: translateX(0); }

    .nnchs-sidebar-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 18px 16px; border-bottom: 1px solid rgba(255,255,255,0.07);
      /* iOS: pad from status bar notch */
      padding-top: max(20px, env(safe-area-inset-top, 20px));
    }
    .nnchs-logo-badge { display: flex; align-items: center; gap: 10px; }
    .nnchs-logo-icon {
      width: 36px; height: 36px; background: #1e4db7;
      border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .nnchs-logo-icon svg { width: 18px; height: 18px; }
    .nnchs-logo-name { font-size: 15px; font-weight: 700; color: #fff; }
    .nnchs-logo-sub {
      font-size: 9.5px; color: rgba(255,255,255,0.3); letter-spacing: 1.5px;
      text-transform: uppercase; font-family: 'JetBrains Mono', monospace; margin-top: 1px;
    }
    .nnchs-close-btn {
      min-width: 36px; min-height: 36px; width: 36px; height: 36px;
      border-radius: 9px; background: rgba(255,255,255,0.08);
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      -webkit-tap-highlight-color: transparent;
    }
    .nnchs-close-btn:hover { background: rgba(255,255,255,0.15); }
    .nnchs-close-btn svg { width: 15px; height: 15px; stroke: rgba(255,255,255,0.75); }

    .nnchs-sidebar-nav {
      flex: 1; padding: 12px 10px;
      display: flex; flex-direction: column; gap: 2px;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }
    .nnchs-nav-label {
      font-size: 9.5px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;
      color: rgba(255,255,255,0.25); font-family: 'JetBrains Mono', monospace;
      padding: 10px 8px 4px; margin-top: 4px;
    }
    .nnchs-nav-item {
      display: flex; align-items: center; gap: 11px; padding: 10px 10px;
      border-radius: 9px; cursor: pointer; text-decoration: none;
      transition: background 0.18s, border-color 0.18s;
      border: 1px solid transparent; position: relative;
      /* Larger tap target on mobile */
      min-height: 44px;
      -webkit-tap-highlight-color: transparent;
    }
    .nnchs-nav-item:hover  { background: rgba(255,255,255,0.06); }
    .nnchs-nav-item:active { background: rgba(255,255,255,0.10); }
    .nnchs-nav-item.active { background: rgba(30,77,183,0.22); border-color: rgba(30,77,183,0.45); }
    .nnchs-nav-item .ni-icon {
      width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; font-size: 16px;
      background: rgba(255,255,255,0.92); color: #0d1117;
    }
    .nnchs-nav-item .ni-icon svg { stroke: #0d1117; }
    .nnchs-nav-item.active .ni-icon { background: #fff; color: #1e4db7; }
    .nnchs-nav-item.active .ni-icon svg { stroke: #1e4db7; }
    .nnchs-nav-item .ni-text { flex: 1; min-width: 0; }
    .nnchs-nav-item .ni-title {
      font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.72); line-height: 1.2;
      transition: color 0.18s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .nnchs-nav-item:hover .ni-title,
    .nnchs-nav-item.active .ni-title { color: #fff; }
    .nnchs-nav-item .ni-sub  { font-size: 10.5px; color: rgba(255,255,255,0.32); margin-top: 1px; }
    .nnchs-nav-item .ni-badge {
      font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 20px;
      background: rgba(30,77,183,0.4); color: rgba(255,255,255,0.85);
      letter-spacing: 0.3px; flex-shrink: 0;
    }
    .nnchs-nav-item .ni-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #3b82f6; flex-shrink: 0;
    }
    .nnchs-nav-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 6px 0; }

    /* Usap Tayo accent */
    .nnchs-nav-item.usap-item .ni-icon { background: rgba(255,255,255,0.92); color: #0ea5e9; }
    .nnchs-nav-item.usap-item .ni-icon svg { stroke: #0ea5e9; }
    .nnchs-nav-item.usap-item.active,
    .nnchs-nav-item.usap-item:hover { background: rgba(14,165,233,0.14); border-color: rgba(14,165,233,0.3); }
    .nnchs-nav-item.usap-item.active .ni-title,
    .nnchs-nav-item.usap-item:hover .ni-title { color: #38bdf8; }

    /* Hamburger button */
    .nnchs-hamburger {
      min-width: 40px; width: 40px; min-height: 40px; height: 40px;
      border-radius: 8px; background: transparent;
      border: 1px solid #e4e7ef; cursor: pointer; display: flex;
      align-items: center; justify-content: center;
      transition: background 0.18s;
      flex-shrink: 0;
      -webkit-tap-highlight-color: transparent;
    }
    .nnchs-hamburger:hover  { background: #f6f7f9; }
    .nnchs-hamburger:active { background: #e9ebf0; }
    .nnchs-hamburger svg { width: 16px; height: 16px; }

    /* Mobile: widen sidebar slightly so text doesn't clip */
    @media (max-width: 360px) {
      .nnchs-sidebar { width: 88vw; }
    }
  `;
  document.head.appendChild(style);

  /* ── SIDEBAR HTML ── */
  const sidebarHTML = `
    <div class="nnchs-overlay" id="nnchsOverlay"></div>
    <aside class="nnchs-sidebar" id="nnchsSidebar" aria-label="Navigation sidebar" role="navigation">
      <div class="nnchs-sidebar-header">
        <div class="nnchs-logo-badge">
          <div class="nnchs-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div class="nnchs-logo-name">NNCHS</div>
            <div class="nnchs-logo-sub">Guidance System</div>
          </div>
        </div>
        <button class="nnchs-close-btn" id="nnchsCloseBtn" aria-label="Close sidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <nav class="nnchs-sidebar-nav">

        <a class="nnchs-nav-item ${activeKey === 'dashboard' ? 'active' : ''}" href="index.html">
          <div class="ni-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </div>
          <div class="ni-text">
            <div class="ni-title">Dashboard</div>
            <div class="ni-sub">Overview &amp; quick links</div>
          </div>
        </a>

        <a class="nnchs-nav-item usap-item ${activeKey === 'usap' ? 'active' : ''}" href="usap-tayo.html">
          <div class="ni-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
          <div class="ni-text">
            <div class="ni-title">Usap Tayo</div>
            <div class="ni-sub">With the Guidance Counselor</div>
          </div>
          <div class="ni-dot"></div>
        </a>

        <div class="nnchs-nav-divider"></div>
        <div class="nnchs-nav-label">Sections</div>

        <a class="nnchs-nav-item ${activeKey === 'hero' ? 'active' : ''}" href="index.html#hero" data-scroll-to=".hero-banner">
          <div class="ni-icon">🏫</div>
          <div class="ni-text"><div class="ni-title">About NNCHS</div></div>
        </a>

        <a class="nnchs-nav-item ${activeKey === 'vmv' ? 'active' : ''}" href="index.html#vmv" data-scroll-to=".vmv-section">
          <div class="ni-icon">📋</div>
          <div class="ni-text"><div class="ni-title">Vision, Mission &amp; Values</div></div>
        </a>

        <a class="nnchs-nav-item ${activeKey === 'services' ? 'active' : ''}" href="index.html#services" data-scroll-to=".services-section">
          <div class="ni-icon">🧭</div>
          <div class="ni-text"><div class="ni-title">Guidance Services</div></div>
          <div class="ni-badge">6</div>
        </a>

        <a class="nnchs-nav-item ${activeKey === 'fb' ? 'active' : ''}" href="index.html#fb-feed-section" data-scroll-to="#fb-feed-section">
          <div class="ni-icon">📘</div>
          <div class="ni-text"><div class="ni-title">Facebook Updates</div></div>
        </a>

        <a class="nnchs-nav-item ${activeKey === 'map' ? 'active' : ''}" href="index.html#map" data-scroll-to=".map-section">
          <div class="ni-icon">📍</div>
          <div class="ni-text"><div class="ni-title">Location Map</div></div>
        </a>

        <div class="nnchs-nav-divider"></div>
        <div class="nnchs-nav-label">External</div>

        <a class="nnchs-nav-item" href="https://www.facebook.com/NabunturanCompre" target="_blank" rel="noopener">
          <div class="ni-icon" style="background:rgba(255,255,255,0.92);">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#1877f2">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.885v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
          </div>
          <div class="ni-text"><div class="ni-title">Facebook Page</div></div>
        </a>

        <a class="nnchs-nav-item" href="https://www.deped.gov.ph" target="_blank" rel="noopener">
          <div class="ni-icon">🎓</div>
          <div class="ni-text"><div class="ni-title">DepEd Official</div></div>
        </a>

      </nav>
    </aside>
  `;

  /* ── INJECT SIDEBAR ── */
  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  /* ── INJECT HAMBURGER into existing topbar ── */
  const topbarLeft = document.querySelector('.topbar-left');
  if (topbarLeft) {
    const ham = document.createElement('button');
    ham.className = 'nnchs-hamburger';
    ham.id = 'nnchsHamburger';
    ham.setAttribute('aria-label', 'Open navigation');
    ham.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>`;
    topbarLeft.insertBefore(ham, topbarLeft.firstChild);
    ham.addEventListener('click', openSidebar);
  }

  /* ── iOS SCROLL LOCK ──
     Prevents the page from scrolling behind the sidebar/overlay on iOS Safari.
     We store the current scrollY, fix the body, then restore it on close.
  ── */
  var _savedScrollY = 0;

  function lockBodyScroll() {
    _savedScrollY = window.pageYOffset || document.documentElement.scrollTop;
    document.body.style.top = '-' + _savedScrollY + 'px';
    document.body.classList.add('nnchs-locked');
  }

  function unlockBodyScroll() {
    document.body.classList.remove('nnchs-locked');
    document.body.style.top = '';
    // Restore scroll position smoothly
    window.scrollTo({ top: _savedScrollY, behavior: 'instant' });
  }

  /* ── OPEN / CLOSE ── */
  function openSidebar() {
    document.getElementById('nnchsSidebar').classList.add('open');
    document.getElementById('nnchsOverlay').classList.add('open');
    lockBodyScroll();
  }

  function closeSidebar() {
    document.getElementById('nnchsSidebar').classList.remove('open');
    document.getElementById('nnchsOverlay').classList.remove('open');
    unlockBodyScroll();
  }

  document.getElementById('nnchsCloseBtn').addEventListener('click', closeSidebar);
  document.getElementById('nnchsOverlay').addEventListener('click', closeSidebar);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSidebar(); });

  /* ── SAME-PAGE SCROLL (for index.html section links) ── */
  document.querySelectorAll('.nnchs-nav-item[data-scroll-to]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (
        window.location.pathname.endsWith('index.html') ||
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/')
      ) {
        e.preventDefault();
        closeSidebar();
        var selector = link.getAttribute('data-scroll-to');
        setTimeout(function () {
          var target = document.querySelector(selector);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 350); // wait for sidebar close + scroll restore
      } else {
        closeSidebar();
      }
    });
  });

  /* close on normal nav link clicks */
  document.querySelectorAll('.nnchs-nav-item:not([data-scroll-to])').forEach(function (link) {
    link.addEventListener('click', closeSidebar);
  });

  /* ── EXPOSE API ── */
  window.NNCHSSidebar = {
    open: openSidebar,
    close: closeSidebar,
    lockBodyScroll: lockBodyScroll,
    unlockBodyScroll: unlockBodyScroll
  };

})();

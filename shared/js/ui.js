/* Shared UI helpers for both Raka concepts: icons, smooth scroll, dialogs, toast,
   the cheese list (kept in localStorage like a cart), WhatsApp links and form checks. */
(function () {
  var RK = window.RK = window.RK || {};
  var reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');

  RK.reducedMotion = function () { return reduceQuery.matches; };
  RK.$ = function (sel, root) { return (root || document).querySelector(sel); };
  RK.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  RK.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  RK.base = (document.currentScript && document.currentScript.src.replace(/js\/ui\.js.*$/, '')) || '../shared/';
  RK.img = function (rel) { return RK.base + 'img/' + rel; };
  RK.media = function (rel) { return RK.base + rel; };

  /* Line icons (paths after Lucide, ISC licence); WhatsApp, Instagram and Facebook are the brand glyphs */
  var P = {
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    left: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    right: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    up: '<path d="M7 17 17 7M8 7h9v9"/>',
    down: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-9 5.7a2 2 0 0 1-2 0L2 7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    nav: '<path d="M3 11 22 2l-9 19-2-8z"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.7a1 1 0 0 0-.2-.6l-3.5-4.3a1 1 0 0 0-.8-.4H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    store: '<path d="m2 7 4.4-4.4A2 2 0 0 1 7.8 2h8.4a2 2 0 0 1 1.4.6L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-2-.8 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-4 0 2.7 2.7 0 0 1-4 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2Z"/>',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6a2 2 0 0 1 .7 1.5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    play: '<path d="M7 4.5v15a1 1 0 0 0 1.5.9l12.2-7.5a1 1 0 0 0 0-1.8L8.5 3.6A1 1 0 0 0 7 4.5Z" fill="currentColor" stroke="none"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checks: '<path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/>',
    basket: '<path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    repeat: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    print: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    edit: '<path d="M21.17 6.81a1 1 0 0 0-3.98-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    sparkle: '<path d="M9.9 15.5a2 2 0 0 0-1.4-1.4l-6.1-1.6a.5.5 0 0 1 0-1l6.1-1.6a2 2 0 0 0 1.4-1.4l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0z"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>',
    snow: '<path d="M2 12h20M12 2v20M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    knife: '<path d="m3 21 9.2-9.2"/><path d="M14.5 3.5a2.1 2.1 0 0 1 3 3L9 15l-3-3z"/>',
    crumble: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="5" width="6" height="6" rx="1"/><rect x="6" y="14" width="5" height="5" rx="1"/><rect x="15" y="15" width="4" height="4" rx="1"/>',
    board: '<circle cx="12" cy="12" r="9"/><path d="M12 3v3M8 12h.01M15 9h.01M14 15h.01M10 16h.01"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    paperclip: '<path d="m21.4 11.1-9.2 9.2a6 6 0 0 1-8.5-8.5l8.6-8.6a4 4 0 0 1 5.6 5.7l-8.5 8.5a2 2 0 0 1-2.9-2.8l8-8"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>',
    volume: '<path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z"/><path d="M16 9a5 5 0 0 1 0 6M19.4 18.4a9 9 0 0 0 0-12.7"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1 1 12.6 8a4 4 0 0 1 3.4 3.4z"/><path d="M17.5 6.5h.01"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    whatsapp: '<path fill="currentColor" stroke="none" d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1a8.2 8.2 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1.1 2.5 5.9 5.9 0 0 0 1.2 3.1c.2.2 2.1 3.2 5 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.8-.7 2-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.3ZM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8Zm8.4-18.2A11.8 11.8 0 0 0 1.8 17.8L.1 24l6.4-1.7A11.8 11.8 0 0 0 12 23.7a11.8 11.8 0 0 0 8.4-20.1Z"/>'
  };
  RK.icon = function (name, cls) {
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || '') + '</svg>';
  };
  RK.hydrateIcons = function (root) {
    RK.$$('[data-icon]', root).forEach(function (el) {
      if (!el.firstElementChild) el.innerHTML = RK.icon(el.getAttribute('data-icon'));
    });
  };

  /* Smooth wheel scrolling (Lenis, MIT). Touch, keyboard and reduced motion keep native scrolling.
     ScrollTrigger, when present, is driven from the same frame so pinned scenes stay in step. */
  RK.lenis = null;
  RK.smoothScroll = function () {
    if (!RK.lenis && !RK.reducedMotion() && typeof window.Lenis !== 'undefined') {
      var gsapOn = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
      RK.lenis = new window.Lenis({ lerp: 0.09, wheelMultiplier: 0.95, smoothWheel: true, allowNestedScroll: true, autoRaf: !gsapOn });
      if (gsapOn) {
        RK.lenis.on('scroll', window.ScrollTrigger.update);
        window.gsap.ticker.add(function (t) { RK.lenis.raf(t * 1000); });
        window.gsap.ticker.lagSmoothing(0);
      }
    }
    // In-page links glide and land below the fixed header
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var href = a.getAttribute('href');
      var target = href === '#top' ? 0 : href.length > 1 ? RK.$(href) : null;
      if (target === null) return;
      e.preventDefault();
      RK.modal.closeAll();
      RK.scrollTo(target);
    });
  };
  RK.scrollTo = function (target, opts) {
    opts = opts || {};
    if (typeof target === 'string') target = RK.$(target);
    if (target === null || target === undefined) return;
    var y = typeof target === 'number' ? target
      : target.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0);
    if (RK.lenis) RK.lenis.scrollTo(y, { duration: opts.duration || Math.min(1.8, 0.7 + Math.abs(y - scrollY) / 5000), force: true });
    else window.scrollTo({ top: y, behavior: RK.reducedMotion() || opts.immediate ? 'auto' : 'smooth' });
  };
  RK.go = function (sel, focusSel) {
    var target = RK.$(sel);
    if (!target) return;
    RK.modal.closeAll();
    RK.scrollTo(target);
    if (focusSel) setTimeout(function () { var f = RK.$(focusSel); if (f) f.focus({ preventScroll: true }); }, RK.reducedMotion() ? 0 : 1000);
  };

  /* Dialogs: native <dialog> gives the focus trap, Esc and an inert page */
  RK.modal = {
    open: function (html, opts) {
      opts = opts || {};
      var d = document.createElement('dialog');
      d.className = 'rk-dialog ' + (opts.className || '');
      d.setAttribute('data-lenis-prevent', '');
      d.innerHTML = '<div class="rk-dialog__panel">' + html + '<button class="rk-dialog__close" type="button" aria-label="Close">' + RK.icon('close') + '</button></div>';
      if (opts.label) d.setAttribute('aria-label', opts.label);
      document.body.appendChild(d);
      d.addEventListener('click', function (e) { if (e.target === d) RK.modal.close(d); });
      d.addEventListener('cancel', function (e) { e.preventDefault(); RK.modal.close(d); });
      d.querySelector('.rk-dialog__close').addEventListener('click', function () { RK.modal.close(d); });
      RK.hydrateIcons(d);
      d.showModal();
      d.querySelector('.rk-dialog__close').focus({ preventScroll: true });
      d.scrollTop = 0;
      document.documentElement.classList.add('rk-modal-open');
      if (RK.lenis) RK.lenis.stop();
      if (opts.onOpen) opts.onOpen(d);
      return d;
    },
    close: function (d) {
      d = d || RK.$('dialog.rk-dialog[open]:not(.is-closing)');
      if (!d || d.classList.contains('is-closing')) return;
      d.classList.add('is-closing');
      RK.$$('video', d).forEach(function (v) { v.pause(); });
      var last = !RK.$$('dialog.rk-dialog[open]').some(function (x) { return x !== d && !x.classList.contains('is-closing'); });
      if (last) {
        document.documentElement.classList.remove('rk-modal-open');
        if (RK.lenis) RK.lenis.start();
      }
      var done = function () { d.close(); d.remove(); };
      if (RK.reducedMotion()) done(); else setTimeout(done, 220);
    },
    closeAll: function () { RK.$$('dialog.rk-dialog[open]').forEach(function (d) { RK.modal.close(d); }); }
  };

  RK.toast = function (msg, action) {
    var t = RK.$('.rk-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'rk-toast';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.innerHTML = '<span class="rk-toast__tick">' + RK.icon('check') + '</span><span>' + RK.esc(msg) + '</span>' +
      (action ? '<button type="button" class="rk-toast__act">' + RK.esc(action.label) + '</button>' : '');
    if (action) t.querySelector('.rk-toast__act').addEventListener('click', function () { t.classList.remove('is-on'); action.run(); });
    t.classList.add('is-on');
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove('is-on'); }, 3600);
  };

  /* Pointer tilt: sets --rx, --ry, --mx, --my */
  RK.tilt = function (els, max) {
    max = max || 6;
    if (RK.reducedMotion() || matchMedia('(hover: none)').matches) return;
    els.forEach(function (el) {
      var raf = 0;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.setProperty('--rx', ((0.5 - py) * max).toFixed(2) + 'deg');
          el.style.setProperty('--ry', ((px - 0.5) * max).toFixed(2) + 'deg');
          el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        });
      });
      el.addEventListener('pointerleave', function () {
        cancelAnimationFrame(raf);
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  };

  /* Muted loops play only while on screen */
  RK.autoVideos = function (root) {
    var vids = RK.$$('video[data-autoplay]', root);
    if (!vids.length) return;
    if (RK.reducedMotion()) { vids.forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () { /* autoplay blocked: poster stays */ }); }
        else v.pause();
      });
    }, { rootMargin: '120px 0px' });
    vids.forEach(function (v) { v.muted = true; v.playsInline = true; io.observe(v); });
  };

  RK.headerScroll = function (el) {
    var last = 0;
    var on = function () {
      var y = window.scrollY;
      el.classList.toggle('is-scrolled', y > 8);
      el.classList.toggle('is-hidden', y > 600 && y > last + 4 && !document.documentElement.classList.contains('rk-modal-open'));
      if (y < last - 4) el.classList.remove('is-hidden');
      last = y;
    };
    on();
    addEventListener('scroll', on, { passive: true });
  };

  /* ---------- The cheese list: { 'productId|packId': count } ---------- */
  var memo = {};
  RK.list = {
    key: 'rk-list-draft',
    get: function () {
      try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch (e) { return Object.assign({}, memo); }
    },
    save: function (o) {
      Object.keys(o).forEach(function (k) { if (!(o[k] > 0) || !RK.packOf(k)) delete o[k]; });
      memo = o;
      try { localStorage.setItem(this.key, JSON.stringify(o)); } catch (e) { /* storage blocked: memo keeps it */ }
      document.dispatchEvent(new CustomEvent('rk:list', { detail: o }));
    },
    qty: function (key) { return this.get()[key] || 0; },
    set: function (key, n) {
      var o = this.get();
      o[key] = Math.max(0, Math.min(999, Math.round(+n || 0)));
      this.save(o);
      return o[key] || 0;
    },
    add: function (key, n) { return this.set(key, this.qty(key) + (n || 1)); },
    total: function (o) {
      o = o || this.get();
      return Object.keys(o).reduce(function (t, k) { return t + o[k]; }, 0);
    },
    lines: function (o) {
      o = o || this.get();
      var out = [];
      RK.products.forEach(function (p) {
        p.packs.forEach(function (pk) {
          var key = p.id + '|' + pk.id;
          if (o[key] > 0) out.push({ key: key, product: p, pack: pk, qty: o[key] });
        });
      });
      return out;
    },
    grams: function (o) {
      return this.lines(o).reduce(function (t, l) { return t + l.pack.g * l.qty; }, 0);
    },
    history: function () {
      try { return JSON.parse(localStorage.getItem('rk-orders')) || []; } catch (e) { return []; }
    },
    remember: function (record) {
      try {
        var all = this.history();
        all.push(record);
        localStorage.setItem('rk-orders', JSON.stringify(all.slice(-20)));
      } catch (e) { /* storage blocked: the confirmation still shows */ }
    }
  };
  RK.packOf = function (key) {
    var parts = String(key).split('|'), p = RK.product(parts[0]);
    if (!p) return null;
    return p.packs.find(function (k) { return k.id === parts[1]; }) || null;
  };
  RK.weight = function (g) {
    if (g >= 1000) return (Math.round(g / 100) / 10).toString().replace(/\.0$/, '') + ' kg';
    return g + ' g';
  };
  RK.packs = function (n) { return n + (n === 1 ? ' pack' : ' packs'); };

  RK.addToList = function (productId, packId, n, quiet) {
    var p = RK.product(productId);
    if (!p) return;
    var pk = packId ? p.packs.find(function (k) { return k.id === packId; }) : p.packs[p.def || 0];
    if (!pk) pk = p.packs[0];
    RK.list.add(p.id + '|' + pk.id, n || 1);
    if (!quiet) RK.toast((n || 1) + ' × ' + pk.label + ' ' + p.name + ' added to your cheese list', { label: 'View list', run: function () { RK.go('#order'); } });
  };

  /* Every [data-list-count] badge follows the list */
  RK.bindListCount = function () {
    var paint = function () {
      var t = RK.list.total();
      RK.$$('[data-list-count]').forEach(function (el) {
        var changed = el.textContent !== String(t);
        el.textContent = t;
        el.hidden = !t;
        if (changed && t && !RK.reducedMotion()) el.animate([{ transform: 'scale(1.5)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'cubic-bezier(.3,1.6,.5,1)' });
        var host = el.closest('[data-list-host]');
        if (host) host.setAttribute('aria-label', t ? 'Your cheese list, ' + RK.packs(t) : 'Your cheese list is empty');
      });
    };
    paint();
    document.addEventListener('rk:list', paint);
  };

  /* Quantity stepper used by the list and the pop-ups */
  RK.stepperHTML = function (key, value, label) {
    return '<div class="qty" data-qty="' + key + '">' +
      '<button type="button" data-step="-1" aria-label="One less">' + RK.icon('minus') + '</button>' +
      '<input type="number" inputmode="numeric" min="0" max="999" value="' + value + '" aria-label="' + RK.esc(label) + '">' +
      '<button type="button" data-step="1" aria-label="One more">' + RK.icon('plus') + '</button></div>';
  };
  RK.stepperValue = function (box) {
    var v = Math.round(+box.querySelector('input').value || 0);
    return Math.max(0, Math.min(999, v));
  };

  /* ---------- WhatsApp ---------- */
  RK.wa = function (text) { return 'https://wa.me/' + RK.company.wa + (text ? '?text=' + encodeURIComponent(text) : ''); };
  RK.openWa = function (text) { window.open(RK.wa(text), '_blank', 'noopener'); };
  RK.listText = function (lines) {
    lines = lines || RK.list.lines();
    return lines.map(function (l) { return '• ' + l.qty + ' × ' + l.product.name + ', ' + l.pack.label; }).join('\n');
  };

  RK.reference = function (prefix) {
    var d = new Date();
    return prefix + '-' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  };

  /* ---------- Form checks ---------- */
  RK.rules = {
    name: function (v) { return v.trim().length > 1 || 'Tell us your name.'; },
    phone: function (v) {
      var d = v.replace(/[\s\-()]/g, '');
      return /^(\+?254|0)(7|1)\d{8}$/.test(d) || 'Use a Kenyan mobile number, for example 0712 345 678.';
    },
    email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Check the email address.'; },
    required: function (msg) { return function (v) { return !!String(v || '').trim() || msg; }; },
    consent: function (v, f) { return f.elements.consent.checked || 'Please tick the box so we can contact you.'; }
  };
  function fieldOf(el) { return el.closest('.field') || el.parentNode; }
  function setError(el, msg) {
    var f = fieldOf(el), box = f.querySelector('.field__error');
    if (!box) { box = document.createElement('p'); box.className = 'field__error'; f.appendChild(box); }
    box.textContent = msg || '';
    f.classList.toggle('has-error', !!msg);
    if (el.setAttribute) { if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); }
  }
  RK.validateForm = function (form, rules) {
    var first = null;
    Object.keys(rules).forEach(function (name) {
      var el = form.elements[name];
      if (!el) return;
      var target = el.length && !el.tagName ? el[0] : el;
      if (target.closest && target.closest('[hidden]')) { setError(target, ''); return; }
      var value = el.type === 'checkbox' ? el.checked : el.value;
      var ok = rules[name](value || '', form);
      setError(target, ok === true ? '' : ok);
      if (ok !== true && !first) first = target;
    });
    return first;
  };
  RK.liveValidate = function (form, rules, armed) {
    form.addEventListener('input', function (e) {
      var name = e.target.name;
      if (!rules[name] || !armed()) return;
      var el = form.elements[name];
      var value = e.target.type === 'checkbox' ? e.target.checked : el.value;
      var ok = rules[name](value || '', form);
      setError(el.length && !el.tagName ? el[0] : el, ok === true ? '' : ok);
    });
  };
  RK.optionsHTML = function (list, placeholder) {
    return (placeholder ? '<option value="">' + RK.esc(placeholder) + '</option>' : '') + list.map(function (o) { return '<option>' + RK.esc(o) + '</option>'; }).join('');
  };

  /* Social links from RK.socials fill every [data-socials] element:
     "icons" gives round buttons, "labels" adds the network name and handle. */
  RK.fillSocials = function (root) {
    RK.$$('[data-socials]', root).forEach(function (el) {
      var labels = el.getAttribute('data-socials') === 'labels';
      el.innerHTML = RK.socials.map(function (s) {
        return '<a class="social social--' + s.id + '" href="' + s.href + '" target="_blank" rel="noopener"' +
          (labels ? '' : ' aria-label="' + RK.esc(s.label) + ' (opens in a new tab)"') + '>' +
          '<span class="social__icon">' + RK.icon(s.id) + '</span>' +
          (labels ? '<span class="social__text"><strong>' + s.name + '</strong><span>' + RK.esc(s.handle) + '</span></span>' : '') + '</a>';
      }).join('');
    });
  };

  /* Open or closed right now, in Nyeri time (EAT, UTC+3) */
  RK.openState = function () {
    var now = new Date(Date.now() + 3 * 3600000);
    var day = now.getUTCDay(), mins = now.getUTCHours() * 60 + now.getUTCMinutes();
    var spans = RK.company.week[day];
    var open = spans && mins >= spans[0] && mins < spans[1];
    if (open) return { open: true, label: 'Open now', sub: 'Closes at ' + hm(spans[1]) };
    for (var i = 0; i < 8; i++) {
      var d = (day + i) % 7, s = RK.company.week[d];
      if (!s) continue;
      if (i === 0 && mins < s[0]) return { open: false, label: 'Closed now', sub: 'Opens today at ' + hm(s[0]), day: 'Today' };
      if (i > 0) {
        var name = i === 1 ? 'Tomorrow' : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d];
        return { open: false, label: 'Closed now', sub: 'Opens ' + (i === 1 ? 'tomorrow' : name) + ' at ' + hm(s[0]), day: name };
      }
    }
    return { open: false, label: 'Closed now', sub: '' };
    function hm(m) { var h = Math.floor(m / 60), mm = m % 60; return (h > 12 ? h - 12 : h) + (mm ? ':' + String(mm).padStart(2, '0') : '') + (h >= 12 ? 'pm' : 'am'); }
  };

  document.addEventListener('DOMContentLoaded', function () { RK.hydrateIcons(document); RK.fillSocials(document); });
})();

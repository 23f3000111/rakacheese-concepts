/* Motion layer shared by both concepts (GSAP, ScrollTrigger and SplitText, vendored).
   Markup asks for motion with data attributes; reduced motion or a missing library leaves everything still and visible.
   data-reveal="up|lines|chars|words|clip|scale|stagger|fade"   data-delay="0.2"
   data-parallax="-0.15" (share of own height)   data-marquee (data-speed)   data-count="2001"   data-magnetic   data-spin="20" */
(function () {
  var RK = window.RK;
  var html = document.documentElement;
  RK.fx = { on: false };

  RK.fx.init = function () {
    var g = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
    if (!g || !ST || RK.reducedMotion()) { html.classList.remove('js'); html.classList.add('fx-off'); return; }
    g.registerPlugin(ST);
    if (Split) g.registerPlugin(Split);
    RK.fx.on = true;
    var ease = 'expo.out';

    RK.$$('[data-reveal]').forEach(function (el) {
      if (el.closest('[data-reveal-manual]')) return;
      var type = el.getAttribute('data-reveal') || 'up';
      var delay = +(el.getAttribute('data-delay') || 0);
      var st = { trigger: el, start: el.getAttribute('data-start') || (el.getBoundingClientRect().top + scrollY < innerHeight ? 'top bottom' : 'top 88%'), once: true };
      g.set(el, { visibility: 'visible' });
      if ((type === 'lines' || type === 'chars' || type === 'words') && Split) {
        var s = new Split(el, { type: type === 'chars' ? 'lines,chars' : type === 'words' ? 'lines,words' : 'lines', mask: 'lines', linesClass: 'fx-line' });
        var parts = type === 'chars' ? s.chars : type === 'words' ? s.words : s.lines;
        g.from(parts, { yPercent: 115, duration: type === 'chars' ? 1.1 : 1.15, ease: ease, stagger: type === 'chars' ? 0.028 : type === 'words' ? 0.05 : 0.09, delay: delay, scrollTrigger: st });
      } else if (type === 'clip') {
        var img = el.querySelector('img, video');
        g.fromTo(el, { clipPath: 'inset(18% 12% 18% 12% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.4, ease: 'expo.inOut', delay: delay, scrollTrigger: st, clearProps: 'clipPath' });
        if (img) g.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.6, ease: 'expo.out', delay: delay, scrollTrigger: st });
      } else if (type === 'scale') {
        g.from(el, { scale: 0.86, autoAlpha: 0, duration: 1.1, ease: 'back.out(1.6)', delay: delay, scrollTrigger: st });
      } else if (type === 'stagger') {
        g.from(el.children, { y: 46, autoAlpha: 0, duration: 1, ease: ease, stagger: 0.08, delay: delay, scrollTrigger: st });
      } else if (type === 'fade') {
        g.from(el, { autoAlpha: 0, duration: 1.2, ease: 'power2.out', delay: delay, scrollTrigger: st });
      } else {
        g.from(el, { y: 56, autoAlpha: 0, duration: 1.15, ease: ease, delay: delay, scrollTrigger: st });
      }
    });

    RK.$$('[data-parallax]').forEach(function (el) {
      var amt = +el.getAttribute('data-parallax');
      g.fromTo(el, { yPercent: -amt * 50 }, { yPercent: amt * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    RK.$$('[data-spin]').forEach(function (el) {
      g.to(el, { rotation: 360, duration: +el.getAttribute('data-spin') || 20, ease: 'none', repeat: -1 });
    });

    RK.$$('[data-count]').forEach(function (el) {
      var to = +el.getAttribute('data-count'), from = +(el.getAttribute('data-from') || 0), o = { v: from };
      g.to(o, { v: to, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString('en-GB').replace(/,/g, el.hasAttribute('data-nosep') ? '' : ','); } });
    });

    /* Marquees: duplicate the track, loop it, and let scroll speed push it along */
    var marquees = RK.$$('[data-marquee]').map(function (el) {
      var track = el.firstElementChild;
      track.innerHTML += track.innerHTML;
      var right = el.getAttribute('data-dir') === 'right';
      return g.fromTo(track, { xPercent: right ? -50 : 0 }, { xPercent: right ? 0 : -50, duration: +(el.getAttribute('data-speed') || 30), ease: 'none', repeat: -1 });
    });
    if (marquees.length) {
      ST.create({ onUpdate: function (self) {
        var v = Math.min(Math.abs(self.getVelocity()) / 400, 5);
        marquees.forEach(function (tw) { g.to(tw, { timeScale: 1 + v, duration: 0.2, overwrite: true }); g.to(tw, { timeScale: 1, duration: 1.2, delay: 0.25 }); });
      } });
    }

    if (!matchMedia('(hover: none)').matches) {
      RK.$$('[data-magnetic]').forEach(function (el) {
        var x = g.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }), y = g.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          x((e.clientX - r.left - r.width / 2) * 0.3);
          y((e.clientY - r.top - r.height / 2) * 0.35);
        });
        el.addEventListener('pointerleave', function () { x(0); y(0); });
      });
    }

    html.classList.add('fx-ready');
    addEventListener('load', function () { ST.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
  };
})();

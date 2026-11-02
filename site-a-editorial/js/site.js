/* Concept A, editorial: builds the range list, the plate parade, the five moods and the boards,
   then adds the motion (hero type, cheese drip, pinned plates) on top of the shared fx layer. */
(function () {
  var RK = window.RK, $ = RK.$, $$ = RK.$$, esc = RK.esc;
  var pad = function (n) { return String(n).padStart(2, '0'); };

  /* ---------- The range: a list and a picture that follows ---------- */
  function buildRange() {
    var list = $('[data-range-list]');
    list.innerHTML = RK.products.map(function (p, i) {
      return '<li class="range__item' + (i ? '' : ' is-on') + '" style="--c:' + p.color + '"><button type="button" class="range__btn" data-i="' + i + '">' +
        '<span class="range__n">' + pad(i + 1) + '</span><span><span class="range__name">' + esc(p.name) + '</span>' +
        '<span class="range__sub mono">' + esc(p.uses.slice(0, 3).join(' · ')) + '</span></span><span class="arr">&#8599;</span></button></li>';
    }).join('');
    var img = $('[data-range-img]'), next = $('[data-range-next]'), tag = $('[data-range-tag]'), pack = $('[data-range-pack]');
    var current = 0, busy = null;
    function show(i) {
      if (i === current) return;
      current = i;
      var p = RK.products[i];
      $$('.range__item', list).forEach(function (li, k) { li.classList.toggle('is-on', k === i); });
      tag.textContent = pad(i + 1) + ' / ' + p.name;
      if (p.pack) { pack.hidden = false; $('img', pack).src = RK.img(p.pack); } else pack.hidden = true;
      var src = RK.img(p.wide);
      if (!RK.fx.on) { img.src = src; return; }
      next.src = src;
      if (busy) busy.kill();
      busy = gsap.timeline({ onComplete: function () { img.src = src; gsap.set(next, { clipPath: 'inset(100% 0 0 0)' }); } })
        .fromTo(next, { clipPath: 'inset(100% 0 0 0)', scale: 1.12 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: .75, ease: 'expo.out' });
      if (!RK.reducedMotion()) pack.animate([{ rotate: '5deg', translate: '0 0' }, { rotate: '-3deg', translate: '0 -10px' }, { rotate: '5deg', translate: '0 0' }], { duration: 600, easing: 'cubic-bezier(.3,1.4,.5,1)' });
    }
    list.addEventListener('pointerover', function (e) { var b = e.target.closest('.range__btn'); if (b) show(+b.getAttribute('data-i')); });
    list.addEventListener('focusin', function (e) { var b = e.target.closest('.range__btn'); if (b) show(+b.getAttribute('data-i')); });
    list.addEventListener('click', function (e) { var b = e.target.closest('.range__btn'); if (b) RK.openProduct(RK.products[+b.getAttribute('data-i')].id); });
    RK.products.forEach(function (p) { var im = new Image(); im.src = RK.img(p.wide); });
  }

  /* ---------- Pass the plate ---------- */
  function buildPlates() {
    var track = $('[data-plates]');
    track.innerHTML = RK.recipes.filter(function (r) { return r.plate; }).map(function (r, i) {
      var cheese = r.cheese.map(function (c) { return RK.product(c[0]).short; }).join(' + ');
      return '<li class="plate"><span class="plate__tag mono">' + pad(i + 1) + ' / ' + esc(r.name) + '</span>' +
        '<button type="button" class="plate__btn" data-open-recipe="' + r.id + '" aria-label="Recipe: ' + esc(r.name) + '"><img src="' + RK.img(r.plate) + '" alt="" width="900" height="900" loading="lazy"></button>' +
        '<p class="plate__meta"><strong>' + esc(r.name) + '</strong><span class="mono">' + r.mins + ' min &middot; ' + esc(cheese) + '</span></p></li>';
    }).join('') +
      '<li class="plates__end"><p>Hungry yet?</p><a class="btn btn--primary" href="#order">Get the cheese <span class="arr">&#8599;</span></a></li>';
  }

  /* ---------- Five moods ---------- */
  function buildMoods() {
    var slides = $('[data-mood-slides]'), tabs = $('[data-mood-tabs]'), nEl = $('[data-mood-n]'), bar = $('[data-mood-bar]');
    slides.innerHTML = RK.moods.map(function (m, i) {
      var cheeses = RK.products.filter(function (p) { return p.moods.indexOf(m.id) > -1; });
      return '<article class="mood' + (i ? '' : ' is-on') + '" id="mood-' + m.id + '" role="tabpanel" aria-label="' + esc(m.name) + '">' +
        '<img src="' + RK.img(m.img) + '" alt="" width="1600" height="1000" loading="lazy">' +
        '<div class="mood__text"><p class="mono">' + pad(i + 1) + ' / ' + esc(m.name) + '</p><h3>' + esc(m.line) + '</h3><p>' + esc(m.desc) + '</p>' +
        '<div class="mood__chips">' + cheeses.map(function (p) { return '<button type="button" class="rk-chip" data-open-product="' + p.id + '" style="--c:' + p.color + '"><i></i>' + esc(p.name) + '</button>'; }).join('') + '</div></div></article>';
    }).join('');
    tabs.innerHTML = RK.moods.map(function (m, i) {
      return '<button type="button" role="tab" aria-selected="' + (i ? 'false' : 'true') + '" aria-controls="mood-' + m.id + '" data-mood="' + i + '"><span class="mono">' + pad(i + 1) + '</span><strong>' + esc(m.name) + '</strong></button>';
    }).join('');
    var cur = 0, timer = null, prog = null;
    var all = $$('.mood', slides);
    function go(i, user) {
      if (i === cur) return;
      var from = all[cur], to = all[i];
      cur = i;
      nEl.textContent = pad(i + 1);
      $$('[data-mood]', tabs).forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      if (RK.fx.on) {
        gsap.set(to, { zIndex: 2, visibility: 'visible' });
        gsap.timeline({ onComplete: function () { from.classList.remove('is-on'); gsap.set(from, { visibility: 'hidden', zIndex: '' }); to.classList.add('is-on'); gsap.set(to, { zIndex: '' }); } })
          .fromTo(to, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1, ease: 'expo.inOut' })
          .fromTo($('img', to), { scale: 1.2, xPercent: 6 }, { scale: 1, xPercent: 0, duration: 1.4, ease: 'expo.out' }, 0)
          .from($$('.mood__text > *', to), { y: 40, autoAlpha: 0, stagger: .07, duration: .8, ease: 'expo.out' }, .45);
      } else {
        from.classList.remove('is-on');
        to.classList.add('is-on');
      }
      if (user) restart();
    }
    function restart() {
      if (prog) prog.kill();
      if (!RK.fx.on) return;
      prog = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 6, ease: 'none', onComplete: function () { go((cur + 1) % all.length); restart(); } });
    }
    tabs.addEventListener('click', function (e) { var b = e.target.closest('[data-mood]'); if (b) go(+b.getAttribute('data-mood'), true); });
    tabs.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var n = (cur + (e.key === 'ArrowRight' ? 1 : all.length - 1)) % all.length;
      go(n, true);
      $$('[data-mood]', tabs)[n].focus();
    });
    var stage = $('.moods__stage');
    stage.addEventListener('pointerenter', function () { if (prog) prog.pause(); });
    stage.addEventListener('pointerleave', function () { if (prog) prog.resume(); });
    RK.startMoods = function () {
      if (!RK.fx.on) return;
      ScrollTrigger.create({ trigger: stage, start: 'top 75%', once: true, onEnter: restart });
    };
  }

  /* ---------- Boards ---------- */
  function buildBoards() {
    var list = $('[data-boards]'), img = $('[data-board-img]');
    list.innerHTML = RK.boards.map(function (b, i) {
      return '<li' + (i ? '' : ' class="is-on"') + '><button type="button" data-board="' + b.id + '" data-i="' + i + '"><span>' + esc(b.name) + '</span><em>' + esc(b.guests) + ' guests</em></button></li>';
    }).join('') + '<li class="is-cta"><button type="button" data-board="family">Book a board <span class="arr">&#8599;</span></button></li>';
    var srcs = [RK.img('life/grazing-1.webp'), RK.img('life/board-1.webp'), RK.img('life/grazing-2.webp'), RK.img('life/grazing-3.webp')];
    srcs.forEach(function (s) { var i = new Image(); i.src = s; });
    list.addEventListener('pointerover', function (e) {
      var b = e.target.closest('[data-i]');
      if (!b) return;
      var i = +b.getAttribute('data-i');
      $$('li', list).forEach(function (li, k) { li.classList.toggle('is-on', k === i); });
      var src = srcs[i];
      if (img.src.indexOf(src) > -1) return;
      img.style.opacity = .2;
      setTimeout(function () { img.src = src; img.style.opacity = 1; }, 160);
    });
    list.addEventListener('click', function (e) { var b = e.target.closest('[data-board]'); if (b) RK.openBoard(b.getAttribute('data-board')); });
  }

  function openStatus() {
    var el = $('[data-open-status]'), s = RK.openState();
    if (!el) return;
    $('span', el).textContent = s.label + (s.sub ? ' · ' + s.sub : '');
    el.classList.toggle('is-closed', !s.open);
  }

  /* ---------- Motion that belongs to this concept ---------- */
  function motion() {
    if (!RK.fx.on) return;
    var g = gsap;

    // hero: the wordmark rises letter by letter, the video wipes in
    var chars = [];
    $$('[data-hero-line]').forEach(function (line) {
      var s = new SplitText(line, { type: 'chars', charsClass: 'hc' });
      chars.push(s.chars);
    });
    var tl = g.timeline({ defaults: { ease: 'expo.out' } });
    tl.from(chars[0], { yPercent: 110, duration: 1.3, stagger: .06 }, .1)
      .from(chars[1], { yPercent: 110, duration: 1.3, stagger: .05 }, .25)
      .fromTo('[data-hero-media]', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'expo.inOut' }, 0)
      .fromTo('.hero__video', { scale: 1.3 }, { scale: 1, duration: 2, ease: 'expo.out' }, .3)
      .from('.hero__vert', { autoAlpha: 0, yPercent: 20, duration: 1.2 }, .9)
      .from('.sticker', { scale: 0, rotation: -120, duration: 1.2, ease: 'back.out(1.6)' }, 1)
      .from('.hero__chip', { autoAlpha: 0, x: -20, duration: .8 }, 1.2);
    g.to('.hero__video', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    g.to('.hero__word', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // the cheese drip lengthens as the band comes up, the lines slide in from alternate sides
    g.fromTo('.band__drip', { scaleY: .35 }, { scaleY: 1.25, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'center center', scrub: true } });
    $$('[data-band-line]').forEach(function (l, i) {
      g.fromTo(l, { xPercent: i % 2 ? 18 : -18 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'center 55%', scrub: true } });
    });

    // pass the plate: pinned, the plates travel left and turn
    var track = $('[data-plates]'), pin = $('.plates__pin');
    var dist = function () { return Math.max(0, track.scrollWidth - innerWidth); };
    g.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: .6, invalidateOnRefresh: true } });
    $$('.plate__btn img', track).forEach(function (im, i) {
      g.fromTo(im, { rotation: -40 - i * 8 }, { rotation: 140 + i * 6, ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: function () { return '+=' + dist(); }, scrub: .6, invalidateOnRefresh: true } });
    });

    // the founder picture drifts, the footer line rises
    g.from('.ft__big', { yPercent: 30, autoAlpha: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.ft', start: 'top 85%', once: true } });
    if (RK.startMoods) RK.startMoods();
  }

  function init() {
    buildRange();
    buildPlates();
    buildMoods();
    buildBoards();
    openStatus();
    RK.smoothScroll();
    RK.headerScroll($('#hd'));
    RK.bindListCount();
    RK.desk = RK.orderDesk($('[data-desk]'), { viz: 'bar' });
    RK.chat.init({ teaser: 'Habari! 👋 Hungry? Ask me about cheese, recipes or delivery.' });
    $('[data-trade]').addEventListener('click', function () { RK.desk.business(); RK.go('#order'); });
    RK.hydrateIcons(document);
    RK.fillSocials(document);
    RK.autoVideos(document);
    RK.fx.init();
    motion();
  }

  var started = false;
  function start() { if (!started) { started = true; init(); } }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    setTimeout(start, 1500);
  } else document.addEventListener('DOMContentLoaded', start);
})();

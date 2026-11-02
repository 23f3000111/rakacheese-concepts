/* Concept B, fun: the RA-plate-KA hero, a board you turn to meet the range, stacked recipe cards,
   steam you wipe off the oven glass, and the live open sign. */
(function () {
  var RK = window.RK, $ = RK.$, $$ = RK.$$, esc = RK.esc;
  var STEP = 360 / RK.products.length;

  /* ---------- The turning board ---------- */
  function turntable() {
    var section = $('#range'), board = $('[data-board]'), wood = $('[data-board-wood]');
    var nameEl = $('[data-tt-name]'), descEl = $('[data-tt-desc]'), countEl = $('[data-tt-count]'), dashes = $('[data-tt-dashes]'), packsEl = $('[data-tt-packs]');
    var R = 0.36; // ring radius as a share of the board
    wood.innerHTML = RK.products.map(function (p, i) {
      return '<button type="button" class="tt-plate" data-i="' + i + '" tabindex="-1" style="--c:' + p.color + ';transform:rotate(' + (i * STEP) + 'deg) translateX(calc(var(--d) * -' + R + ')) rotate(' + (-i * STEP) + 'deg)">' +
        '<span class="tt-plate__in"><img src="' + RK.img(p.plate) + '" alt="" width="900" height="900" draggable="false"></span><span class="tt-plate__tag"><b>' + esc(p.name) + '</b></span></button>';
    }).join('');
    dashes.innerHTML = RK.products.map(function () { return '<i></i>'; }).join('');
    var plates = $$('.tt-plate', wood);
    var rot = 0, active = -1, tween = null, idle = null, inView = false;

    function setRot(v) {
      rot = v;
      wood.style.transform = 'rotate(' + v + 'deg)';
      wood.style.setProperty('--rot', v + 'deg');
      var i = ((Math.round(-v / STEP) % plates.length) + plates.length) % plates.length;
      if (i !== active) paint(i);
    }
    function paint(i) {
      active = i;
      var p = RK.products[i];
      plates.forEach(function (pl, k) { pl.classList.toggle('is-on', k === i); });
      countEl.textContent = 'Cheese ' + (i + 1) + ' of ' + plates.length;
      $$('i', dashes).forEach(function (d, k) { d.classList.toggle('is-on', k <= i); });
      nameEl.innerHTML = esc(p.name) + ', <em>' + esc(p.tagline.toLowerCase()) + '</em>';
      descEl.textContent = p.desc;
      packsEl.innerHTML = p.packs.map(function (k, n) {
        return '<label><input type="radio" name="tt-pack" value="' + k.id + '"' + (n === (p.def || 0) ? ' checked' : '') + '><span>' + esc(k.label) + '</span></label>';
      }).join('');
      section.style.setProperty('--c', p.color);
      if (RK.fx.on) gsap.fromTo([nameEl, descEl, packsEl], { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .6, stagger: .05, ease: 'expo.out', overwrite: true });
    }
    function goTo(target, dur) {
      if (tween) tween.kill();
      if (!RK.fx.on) { setRot(target); return; }
      var o = { v: rot };
      tween = gsap.to(o, { v: target, duration: dur || .9, ease: 'expo.out', onUpdate: function () { setRot(o.v); } });
    }
    function step(d) { goTo(Math.round(rot / STEP) * STEP - d * STEP); }
    function showPlate(i) {
      var target = -i * STEP, cur = rot;
      var diff = ((target - cur) % 360 + 540) % 360 - 180;
      goTo(cur + diff);
    }
    function restartIdle() {
      clearInterval(idle);
      if (RK.reducedMotion()) return;
      idle = setInterval(function () { if (inView && !dragging && !document.hidden) step(1); }, 4200);
    }

    // drag to turn, with a flick and a snap
    var dragging = false, lastAng = 0, lastT = 0, vel = 0, moved = 0;
    function angleAt(e) {
      var r = board.getBoundingClientRect();
      return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
    }
    board.addEventListener('pointerdown', function (e) {
      dragging = true; moved = 0;
      if (tween) tween.kill();
      board.setPointerCapture(e.pointerId);
      board.classList.add('is-grabbing');
      lastAng = angleAt(e); lastT = performance.now(); vel = 0;
    });
    board.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var a = angleAt(e), now = performance.now();
      var d = a - lastAng; if (d > 180) d -= 360; if (d < -180) d += 360;
      vel = d / Math.max(1, now - lastT) * 16;
      moved += Math.abs(d);
      lastAng = a; lastT = now;
      setRot(rot + d);
    });
    function release(e) {
      if (!dragging) return;
      dragging = false;
      board.classList.remove('is-grabbing');
      if (moved < 3) {
        var hit = document.elementFromPoint(e.clientX, e.clientY);
        var pl = hit && hit.closest('.tt-plate');
        if (pl) { showPlate(+pl.getAttribute('data-i')); restartIdle(); return; }
      }
      var target = Math.round((rot + vel * 9) / STEP) * STEP;
      goTo(target, 1.2);
      restartIdle();
    }
    board.addEventListener('pointerup', release);
    board.addEventListener('pointercancel', release);

    $('[data-tt-next]').addEventListener('click', function () { step(1); restartIdle(); });
    $('[data-tt-prev]').addEventListener('click', function () { step(-1); restartIdle(); });
    $('[data-tt-more]').addEventListener('click', function () { RK.openProduct(RK.products[active].id); });
    $('[data-tt-add]').addEventListener('click', function () {
      var pk = $('input[name="tt-pack"]:checked', packsEl);
      RK.addToList(RK.products[active].id, pk ? pk.value : null, 1);
    });
    section.addEventListener('keydown', function (e) {
      if (e.target.closest('input')) return;
      if (e.key === 'ArrowRight') { step(1); restartIdle(); }
      if (e.key === 'ArrowLeft') { step(-1); restartIdle(); }
    });
    new IntersectionObserver(function (en) { inView = en[0].isIntersecting; }, { threshold: .4 }).observe(section);

    setRot(0);
    if (RK.fx.on) {
      ScrollTrigger.create({ trigger: section, start: 'top 70%', once: true, onEnter: function () {
        var o = { v: 150 };
        gsap.to(o, { v: 0, duration: 2, ease: 'expo.out', onUpdate: function () { setRot(o.v); } });
      } });
    }
    restartIdle();
  }

  /* ---------- Stacked recipe cards ---------- */
  var STACK = ['ugali-fritters', 'margherita', 'chapati-quesadilla', 'paneer-tikka', 'grilled-halloumi', 'watermelon-feta'];
  var TONES = ['', 'card--tomato', 'card--sun'];
  function stack() {
    var box = $('[data-stack]');
    box.innerHTML = STACK.map(function (id, i) {
      var r = RK.recipe(id);
      var cheese = r.cheese.map(function (c) { return 'Raka ' + RK.product(c[0]).name; }).join(' and ');
      return '<article class="card ' + TONES[i % 3] + '">' +
        '<div class="card__img"><img src="' + RK.img(r.plate) + '" alt="' + esc(r.name) + '" width="900" height="900" loading="lazy"></div>' +
        '<div class="card__body"><span class="card__pill">N°' + (i + 1) + ' · ' + esc(r.badge) + '</span>' +
        '<h3 class="card__name">' + esc(r.name.charAt(0).toUpperCase() + r.name.slice(1)) + '</h3>' +
        '<p class="card__cheese">With ' + esc(cheese) + '. Serves ' + r.serves + '.</p>' +
        '<p class="card__time"><strong>' + r.mins + '</strong><span>minutes</span></p>' +
        '<div class="card__btns"><button type="button" class="btn btn--tomato" data-open-recipe="' + r.id + '">Get the recipe</button>' +
        '<button type="button" class="btn btn--outline" data-recipe-cheese="' + r.id + '">Add the cheese</button></div></div></article>';
    }).join('');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-recipe-cheese]');
      if (!b) return;
      var r = RK.recipe(b.getAttribute('data-recipe-cheese'));
      r.cheese.forEach(function (c) { RK.addToList(c[0], c[1], c[2], true); });
      RK.toast('The cheese for ' + r.name + ' is on your list', { label: 'View list', run: function () { RK.go('#order'); } });
    });
    if (!RK.fx.on) return;
    var cards = $$('.card', box);
    cards.forEach(function (c, i) {
      var next = cards[i + 1];
      if (!next) return;
      gsap.fromTo(c, { scale: 1, filter: 'brightness(1)' }, { scale: .92, filter: 'brightness(.86)', ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 104px', scrub: true } });
    });
    cards.forEach(function (c) {
      gsap.from(c.querySelector('.card__img img'), { rotation: -90, scale: .7, ease: 'expo.out', duration: 1.4, scrollTrigger: { trigger: c, start: 'top 80%', once: true } });
    });
  }

  function allRecipes() {
    var html = '<div class="all"><h2 class="h-big">All twelve recipes</h2><div class="all__grid">' + RK.recipes.map(function (r) {
      return '<button type="button" class="all__item" data-open-recipe="' + r.id + '"><img src="' + RK.img(r.plate || r.img) + '" alt="" width="300" height="300"><strong>' + esc(r.name) + '</strong><span>' + r.mins + ' min · ' + esc(RK.product(r.cheese[0][0]).name) + '</span></button>';
    }).join('') + '</div></div>';
    RK.modal.open(html, { className: 'rk-dialog--all', label: 'All recipes' });
  }

  /* ---------- Boards list ---------- */
  function boards() {
    var ul = $('[data-board-list]');
    ul.innerHTML = RK.boards.map(function (b) {
      return '<li><button type="button" data-open-board="' + b.id + '"><strong>' + esc(b.name.replace('The ', '').replace(/^./, function (c) { return c.toUpperCase(); })) + '</strong><em>' + esc(b.guests) + ' guests</em><b>→</b></button></li>';
    }).join('');
  }

  /* ---------- Wipe the steam ---------- */
  function steam() {
    var section = $('.steam'), canvas = $('[data-steam]'), img = $('.steam__img');
    var ctx = canvas.getContext('2d'), fog = document.createElement('canvas'), fctx = fog.getContext('2d');
    var dpr = Math.min(devicePixelRatio || 1, 1.5), w = 0, h = 0, last = null, visible = false, timer = null;
    function paintFog() {
      fog.width = canvas.width; fog.height = canvas.height;
      fctx.filter = 'blur(' + Math.round(22 * dpr) + 'px)';
      var ir = img.naturalWidth / img.naturalHeight, cr = w / h, sw, sh, sx, sy;
      if (ir > cr) { sh = img.naturalHeight; sw = sh * cr; sx = (img.naturalWidth - sw) / 2; sy = 0; } else { sw = img.naturalWidth; sh = sw / cr; sx = 0; sy = (img.naturalHeight - sh) / 2; }
      fctx.drawImage(img, sx, sy, sw, sh, -40, -40, fog.width + 80, fog.height + 80);
      fctx.filter = 'none';
      fctx.fillStyle = 'rgba(255, 246, 232, .52)';
      fctx.fillRect(0, 0, fog.width, fog.height);
      for (var k = 0; k < 90; k++) {
        fctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * .08) + ')';
        fctx.beginPath();
        fctx.arc(Math.random() * fog.width, Math.random() * fog.height, (Math.random() * 3 + .6) * dpr, 0, Math.PI * 2);
        fctx.fill();
      }
    }
    function size() {
      var r = section.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      if (!img.naturalWidth) return;
      paintFog();
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(fog, 0, 0);
    }
    function wipe(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      var rad = 78 * dpr;
      var g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,.85)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    }
    canvas.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect(), x = (e.clientX - r.left) * dpr, y = (e.clientY - r.top) * dpr;
      if (last) {
        var dx = x - last.x, dy = y - last.y, n = Math.ceil(Math.hypot(dx, dy) / (20 * dpr));
        for (var i = 1; i <= n; i++) wipe(last.x + dx * i / n, last.y + dy * i / n);
      } else wipe(x, y);
      last = { x: x, y: y };
      section.classList.add('is-wiped');
    });
    canvas.addEventListener('pointerleave', function () { last = null; });
    function refog() {
      if (!visible || RK.reducedMotion()) return;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = .035;
      ctx.drawImage(fog, 0, 0);
      ctx.globalAlpha = 1;
    }
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      clearInterval(timer);
      if (visible) timer = setInterval(refog, 60);
    }).observe(section);
    if (img.complete && img.naturalWidth) size(); else img.addEventListener('load', size);
    var rt = 0;
    addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 200); });
  }

  /* ---------- Open sign ---------- */
  function openSign() {
    var s = RK.openState();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var today = days[new Date(Date.now() + 3 * 3600000).getUTCDay()];
    $('[data-oc-label]').textContent = s.label;
    $('[data-oc-day]').textContent = s.open ? today : (s.day === 'Today' ? 'Today' : s.day || today);
    $('[data-oc-sub]').textContent = s.sub;
    var pill = $('[data-open-status]');
    $('span', pill).textContent = s.open ? 'Open now, ' + s.sub.toLowerCase() : 'Closed now, ' + s.sub.toLowerCase();
    pill.classList.toggle('is-closed', !s.open);
  }

  /* ---------- Newsletter (client side for the mockup) ---------- */
  function news() {
    var f = $('[data-news]'), msg = $('.ft__msg', f), input = $('input', f);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
      msg.textContent = ok ? 'Asante! You’re on the list for the weekly melt.' : 'Please check the email address.';
      if (ok) input.value = '';
    });
  }

  /* ---------- Motion for this concept ---------- */
  function motion() {
    if (!RK.fx.on) return;
    var g = gsap;
    var tl = g.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('[data-hero-ra]', { xPercent: -60, autoAlpha: 0, duration: 1.4 }, .1)
      .from('[data-hero-ka]', { xPercent: 60, autoAlpha: 0, duration: 1.4 }, .1)
      .from('[data-hero-plate]', { scale: 0, rotation: -200, duration: 1.6, ease: 'back.out(1.4)' }, 0)
      .from('.float', { scale: 0, autoAlpha: 0, rotation: -40, duration: 1.1, stagger: .1, ease: 'back.out(1.8)' }, .6);
    g.to('[data-hero-dish]', { rotation: 360, duration: 60, ease: 'none', repeat: -1 });
    g.to('[data-hero-plate]', { scale: 1.18, rotation: 30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    g.to('[data-hero-ra]', { xPercent: -25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    g.to('[data-hero-ka]', { xPercent: 25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    $$('[data-float]').forEach(function (el) {
      var f = +el.getAttribute('data-float');
      g.to(el, { y: -26 * f, rotation: '+=' + (8 * f), duration: 3 + Math.abs(f), ease: 'sine.inOut', yoyo: true, repeat: -1 });
      g.to(el, { yPercent: -60 * f, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
    if (!matchMedia('(hover: none)').matches) {
      var hero = $('.hero'), qx = $$('.float').map(function (el) { return { el: el, f: +el.getAttribute('data-float'), x: g.quickTo(el, 'x', { duration: .8, ease: 'power3' }) }; });
      hero.addEventListener('pointermove', function (e) {
        var cx = (e.clientX / innerWidth - .5) * 2;
        qx.forEach(function (q) { q.x(cx * 30 * q.f); });
      });
    }
    // inline pictures grow into the headline
    g.fromTo('.inl', { width: 0 }, { width: '2.1em', duration: 1.2, ease: 'expo.out', stagger: .15, clearProps: 'width', scrollTrigger: { trigger: '.season__line', start: 'top 80%', once: true },
      onComplete: function () { $$('.inl').forEach(function (el) { el.classList.add('is-ready'); }); } });
    g.from('.visit__circle', { rotation: -30, duration: 1.4, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.visit__circle', start: 'top 85%', once: true } });
  }

  function init() {
    RK.smoothScroll();
    RK.fx.init();
    turntable();
    stack();
    boards();
    openSign();
    news();
    RK.headerScroll($('#hd'));
    RK.bindListCount();
    RK.desk = RK.orderDesk($('[data-desk]'), { viz: 'board' });
    RK.chat.init({ teaser: 'Habari! 👋 Turn the board, then ask me anything about Raka cheese.' });
    $('[data-all-recipes]').addEventListener('click', allRecipes);
    RK.hydrateIcons(document);
    RK.fillSocials(document);
    RK.autoVideos(document);
    motion();
    steam();
    if (RK.fx.on) ScrollTrigger.refresh();
  }

  var started = false;
  function start() { if (!started) { started = true; init(); } }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    setTimeout(start, 1500);
  } else document.addEventListener('DOMContentLoaded', start);
})();

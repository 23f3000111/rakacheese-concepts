/* The cheese list: pick cheese by the pack, say who it is for, choose delivery, review and send.
   Both concepts use this markup and skin it in their own CSS. opts.viz picks the summary picture:
   'bar' (a colour bar and the total weight) or 'board' (a round cheese board that fills slice by slice). */
(function () {
  var RK = window.RK, $ = RK.$, $$ = RK.$$, esc = RK.esc;
  var C = RK.company;
  var STEPS = ['Pick your cheese', 'About you', 'Delivery', 'Review and send'];
  var SLICES = 12;

  function nextDays(n) {
    var out = [], d = new Date();
    d.setHours(12, 0, 0, 0);
    while (out.length < n) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) out.push(new Date(d));
    }
    return out;
  }
  function longDay(d) { return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); }
  function shortDay(d) { return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }

  function radio(name, value, label, sub, icon, checked) {
    return '<label class="od-choice"><input type="radio" name="' + name + '" value="' + esc(value) + '"' + (checked ? ' checked' : '') + '>' +
      '<span class="od-choice__box">' + (icon ? '<span class="od-choice__icon">' + RK.icon(icon) + '</span>' : '') +
      '<span class="od-choice__text"><strong>' + esc(label) + '</strong>' + (sub ? '<span>' + esc(sub) + '</span>' : '') + '</span>' +
      RK.icon('check', 'od-choice__tick') + '</span></label>';
  }

  RK.orderDesk = function (root, opts) {
    opts = opts || {};
    var viz = opts.viz || 'bar';
    var step = 1, reached = 1, tried = {}, sent = null;
    var days = nextDays(8);

    var items = RK.products.map(function (p) {
      return '<li class="od-item" data-id="' + p.id + '" data-moods="' + p.moods.join(' ') + '" style="--c:' + p.color + ';--tint:' + p.tint + '">' +
        '<button class="od-item__img" type="button" data-open-product="' + p.id + '" aria-label="About ' + esc(p.name) + '">' +
        '<img src="' + RK.img(opts.itemImage === 'pack' && p.pack ? p.pack : p.plate) + '" alt="" width="300" height="300" loading="lazy"></button>' +
        '<div class="od-item__info"><strong>' + esc(p.name) + '</strong><span>' + esc(p.kind) + '</span></div>' +
        '<div class="od-item__packs" role="radiogroup" aria-label="' + esc(p.name) + ' sizes">' + p.packs.map(function (k, i) {
          return '<label><input type="radio" name="pk-' + p.id + '" value="' + k.id + '"' + (i === (p.def || 0) ? ' checked' : '') + '><span>' + esc(k.label) + '</span></label>';
        }).join('') + '</div>' +
        '<button class="od-item__add" type="button" aria-label="Add ' + esc(p.name) + ' to my list">' + RK.icon('plus') + '<span>Add</span></button>' +
        '<span class="od-item__in" aria-hidden="true"></span></li>';
    }).join('');

    root.classList.add('od', 'od--' + viz);
    root.innerHTML =
      '<ol class="od-steps">' + STEPS.map(function (t, i) {
        return '<li><button type="button" data-goto="' + (i + 1) + '"' + (i ? ' disabled' : ' aria-current="step"') + '>' +
          '<span class="od-steps__n">' + (i + 1) + '</span><span class="od-steps__t">' + t + '</span></button></li>';
      }).join('') + '</ol>' +
      '<div class="od-grid"><form class="od-main" novalidate>' +

      // 1. cheese
      '<section class="od-panel" data-panel="1">' +
      '<div class="od-panel__head"><h3 class="od-panel__title" tabindex="-1">Pick your cheese</h3>' +
      '<div class="od-filter" role="group" aria-label="Show cheese for">' +
      '<button type="button" data-filter="all" aria-pressed="true">All ten</button>' +
      RK.moods.map(function (m) { return '<button type="button" data-filter="' + m.id + '" aria-pressed="false">' + m.name + '</button>'; }).join('') +
      '</div></div>' +
      '<div class="od-repeat" hidden></div>' +
      '<ul class="od-items">' + items + '</ul>' +
      '<p class="od-hint">' + RK.icon('info') + 'Pick a size, then add. Tap a picture to read about the cheese.</p></section>' +

      // 2. about you
      '<section class="od-panel" data-panel="2" hidden>' +
      '<div class="od-panel__head"><h3 class="od-panel__title" tabindex="-1">About you</h3><p class="od-panel__sub">So we know who to call and where the cheese is going.</p></div>' +
      '<div class="od-fields">' +
      '<fieldset class="field field--full"><legend>Who is the cheese for?</legend><div class="od-choices od-choices--two">' +
      radio('who', 'Home', 'My home', 'Family, friends, a party', 'home', true) +
      radio('who', 'Business', 'My business', 'Restaurant, hotel, shop, caterer', 'briefcase', false) + '</div></fieldset>' +
      '<div class="field"><label for="od-name">Your name *</label><input id="od-name" name="name" autocomplete="name"></div>' +
      '<div class="field"><label for="od-phone">Phone (WhatsApp) *</label><input id="od-phone" name="phone" type="tel" autocomplete="tel" placeholder="0712 345 678"></div>' +
      '<div class="field"><label for="od-email">Email</label><input id="od-email" name="email" type="email" autocomplete="email" placeholder="you@example.com"></div>' +
      '<div class="od-biz field--full" hidden><div class="od-fields">' +
      '<div class="field"><label for="od-business">Business name *</label><input id="od-business" name="business" autocomplete="organization"></div>' +
      '<div class="field"><label for="od-type">Type of business *</label><select id="od-type" name="type">' + RK.optionsHTML(RK.businessTypes, 'Select one') + '</select></div>' +
      '<div class="field field--full"><label class="check"><input type="checkbox" name="regular" value="yes"><span>I would like a standing weekly order and trade prices</span></label></div>' +
      '</div></div></div></section>' +

      // 3. delivery
      '<section class="od-panel" data-panel="3" hidden>' +
      '<div class="od-panel__head"><h3 class="od-panel__title" tabindex="-1">Delivery</h3><p class="od-panel__sub">Cheese travels chilled. Pick a day: we confirm it on WhatsApp.</p></div>' +
      '<div class="od-fields">' +
      '<fieldset class="field field--full"><legend>How should it reach you? *</legend><div class="od-choices od-choices--three">' +
      radio('method', 'Deliver', 'Deliver to me', 'Chilled, around Nyeri and Nanyuki', 'truck', true) +
      radio('method', 'Courier', 'Courier to my town', 'Nairobi and countrywide, in a cool box', 'snow', false) +
      radio('method', 'Collect', 'I will collect', 'Factory shop, Rware, Nyeri–Nanyuki Road', 'store', false) + '</div></fieldset>' +
      '<div class="field od-area"><label for="od-area">Town *</label><select id="od-area" name="area">' + RK.optionsHTML(RK.areas, 'Select your town') + '</select></div>' +
      '<div class="field od-address"><label for="od-address">Address or landmark *</label><input id="od-address" name="address" placeholder="Estate, street, building, a landmark"></div>' +
      '<fieldset class="field field--full"><legend class="od-day-legend">Delivery day *</legend><div class="od-days">' +
      days.map(function (d) {
        return '<label class="od-day"><input type="radio" name="date" value="' + d.toISOString().slice(0, 10) + '"><span><b>' +
          d.toLocaleDateString('en-GB', { weekday: 'short' }) + '</b>' + d.getDate() + '<i>' + d.toLocaleDateString('en-GB', { month: 'short' }) + '</i></span></label>';
      }).join('') + '</div></fieldset>' +
      '<fieldset class="field field--full"><legend>Time of day</legend><div class="od-choices od-choices--row">' +
      radio('time', 'Morning, 8am to 12pm', 'Morning', '8am to 12pm', 'sun', true) + radio('time', 'Afternoon, 12pm to 5pm', 'Afternoon', '12pm to 5pm', 'clock', false) + '</div></fieldset>' +
      '<fieldset class="field field--full"><legend>How would you like to pay?</legend><div class="od-choices od-choices--row">' +
      ['M-Pesa', 'Cash on delivery', 'Bank transfer', 'On account'].map(function (p, i) { return radio('pay', p, p, '', i === 0 ? 'wallet' : '', i === 0); }).join('') +
      '</div><p class="od-small">Nothing is charged online. We confirm prices and delivery first.</p></fieldset>' +
      '<div class="field field--full"><label for="od-notes">Anything else?</label><textarea id="od-notes" name="notes" rows="2" placeholder="Gate code, a second number, a party date"></textarea></div>' +
      '</div></section>' +

      // 4. review
      '<section class="od-panel" data-panel="4" hidden>' +
      '<div class="od-panel__head"><h3 class="od-panel__title" tabindex="-1">Review and send</h3><p class="od-panel__sub">Check it over, then send it on WhatsApp or as a request.</p></div>' +
      '<div class="od-review"></div>' +
      '<div class="field field--full"><label class="check"><input type="checkbox" name="consent"><span>Raka Cheese may contact me about this order on WhatsApp or by phone. *</span></label></div>' +
      '<div class="od-send"><button type="button" class="btn btn--wa od-send__wa">' + RK.icon('whatsapp') + '<span>Send on WhatsApp</span></button>' +
      '<button type="button" class="btn btn--ghost od-send__req">' + RK.icon('send') + '<span>Send as a request</span></button></div>' +
      '</section>' +

      '<section class="od-panel od-done" data-panel="done" tabindex="-1" hidden></section>' +
      '</form>' +

      '<aside class="od-summary" aria-label="Your cheese list">' +
      '<div class="od-summary__head"><h3>Your cheese list</h3><span class="od-summary__count" aria-live="polite"></span></div>' +
      '<div class="od-viz" aria-hidden="true"></div>' +
      '<p class="od-viz__note"></p>' +
      '<ul class="od-lines"></ul>' +
      '<p class="od-empty">Your list is empty. Add a cheese to start.</p>' +
      '<p class="od-note">' + RK.icon('whatsapp') + '<span>Prices and delivery are confirmed on WhatsApp before anything is packed.</span></p>' +
      '<div class="od-actions"><button class="btn btn--primary od-next" type="button"></button>' +
      '<button class="od-back" type="button" hidden>' + RK.icon('left') + 'Back</button></div>' +
      '<button class="od-share" type="button">' + RK.icon('whatsapp') + 'Just send my list on WhatsApp</button>' +
      '<p class="od-error" role="alert"></p>' +
      '</aside></div>';

    var form = $('.od-main', root), summary = $('.od-summary', root);
    var nextBtn = $('.od-next', root), backBtn = $('.od-back', root), errBox = $('.od-error', root);
    var vizBox = $('.od-viz', root), vizNote = $('.od-viz__note', root);

    if (viz === 'board') {
      vizBox.innerHTML = '<div class="od-board"><div class="od-board__plate"></div><div class="od-board__mid"><strong>0</strong><span>packs</span></div></div>';
    } else {
      vizBox.innerHTML = '<div class="od-big"><strong>0</strong><span>kg</span></div><div class="od-bar"></div>';
    }

    /* ---------- Rules per step ---------- */
    var R = RK.rules;
    var RULES = {
      2: {
        name: R.name, phone: R.phone, email: R.email,
        business: function (v, f) { return f.elements.who.value !== 'Business' || v.trim().length > 1 || 'Add the business name.'; },
        type: function (v, f) { return f.elements.who.value !== 'Business' || !!v || 'Choose the type of business.'; }
      },
      3: {
        method: function (v) { return !!v || 'Choose how the cheese reaches you.'; },
        area: function (v, f) { return f.elements.method.value === 'Collect' || !!v || 'Select your town.'; },
        address: function (v, f) { return f.elements.method.value === 'Collect' || v.trim().length > 3 || 'Add an address or a landmark.'; },
        date: function (v, f) { return !!v || (f.elements.method.value === 'Collect' ? 'Pick a collection day.' : 'Pick a delivery day.'); }
      },
      4: { consent: R.consent }
    };
    [2, 3, 4].forEach(function (n) { RK.liveValidate(form, RULES[n], function () { return tried[n]; }); });

    /* ---------- Paint ---------- */
    function paint() {
      var o = RK.list.get(), lines = RK.list.lines(o), total = RK.list.total(o), grams = RK.list.grams(o);
      $$('.od-item', root).forEach(function (li) {
        var id = li.getAttribute('data-id');
        var n = lines.filter(function (l) { return l.product.id === id; }).reduce(function (t, l) { return t + l.qty; }, 0);
        li.classList.toggle('is-in', n > 0);
        $('.od-item__in', li).textContent = n ? n + ' in list' : '';
      });
      $('.od-summary__count', root).textContent = total ? RK.packs(total) + ' · ' + RK.weight(grams) : 'Empty';
      $('.od-empty', root).hidden = total > 0;
      summary.classList.toggle('is-empty', !total);
      $('.od-share', root).hidden = !total || step === 'done';
      $('.od-lines', root).innerHTML = lines.map(function (l) {
        return '<li style="--c:' + l.product.color + '"><span class="od-lines__dot"></span>' +
          '<span class="od-lines__name"><strong>' + esc(l.product.name) + '</strong><em>' + esc(l.pack.label) + '</em></span>' +
          '<span class="od-lines__qty"><button type="button" data-line="' + l.key + '" data-d="-1" aria-label="One less ' + esc(l.product.name + ' ' + l.pack.label) + '">' + RK.icon('minus') + '</button>' +
          '<b>' + l.qty + '</b><button type="button" data-line="' + l.key + '" data-d="1" aria-label="One more ' + esc(l.product.name + ' ' + l.pack.label) + '">' + RK.icon('plus') + '</button></span>' +
          '<button class="od-lines__x" type="button" data-line="' + l.key + '" data-d="x" aria-label="Remove ' + esc(l.product.name + ' ' + l.pack.label) + '">' + RK.icon('close') + '</button></li>';
      }).join('');
      paintViz(lines, total, grams);
      paintRepeat(total);
      nextLabel();
    }

    function shares(lines, slots) {
      var total = lines.reduce(function (t, l) { return t + l.qty; }, 0);
      if (!total) return [];
      if (total <= slots) return lines.reduce(function (a, l) { for (var i = 0; i < l.qty; i++) a.push(l.product.color); return a; }, []);
      var parts = lines.map(function (l) { var exact = l.qty / total * slots; return { c: l.product.color, n: Math.floor(exact), r: exact % 1 }; });
      var left = slots - parts.reduce(function (t, p) { return t + p.n; }, 0);
      parts.slice().sort(function (a, b) { return b.r - a.r; }).slice(0, left).forEach(function (p) { p.n++; });
      return parts.reduce(function (a, p) { for (var i = 0; i < p.n; i++) a.push(p.c); return a; }, []);
    }

    var lastSlices = 0;
    function paintViz(lines, total, grams) {
      if (viz === 'board') {
        var cols = shares(lines, SLICES), step = 360 / SLICES, gap = 1.6, stops = [];
        for (var i = 0; i < SLICES; i++) {
          var c = cols[i] || 'var(--od-empty-slice)';
          stops.push('transparent ' + (i * step) + 'deg ' + (i * step + gap) + 'deg', c + ' ' + (i * step + gap) + 'deg ' + ((i + 1) * step - gap) + 'deg', 'transparent ' + ((i + 1) * step - gap) + 'deg ' + ((i + 1) * step) + 'deg');
        }
        var plate = $('.od-board__plate', vizBox);
        plate.style.background = 'conic-gradient(from -90deg, ' + stops.join(', ') + ')';
        $('.od-board__mid strong', vizBox).textContent = total;
        $('.od-board__mid span', vizBox).textContent = total === 1 ? 'pack' : 'packs';
        if (cols.length !== lastSlices && !RK.reducedMotion()) plate.animate([{ transform: 'rotate(-14deg) scale(.96)' }, { transform: 'rotate(0) scale(1)' }], { duration: 520, easing: 'cubic-bezier(.3,1.5,.5,1)' });
        lastSlices = cols.length;
        vizNote.textContent = !total ? 'An empty board, ready for cheese.' : total <= SLICES ? 'Each slice is one pack. ' + RK.weight(grams) + ' of cheese so far.' : 'Shown as shares of the board. ' + RK.weight(grams) + ' of cheese.';
      } else {
        $('.od-bar', vizBox).innerHTML = lines.map(function (l) {
          return '<span style="flex:' + (l.pack.g * l.qty) + ';background:' + l.product.color + '" title="' + esc(l.product.name) + ', ' + RK.weight(l.pack.g * l.qty) + '"></span>';
        }).join('');
        var kg = grams >= 1000;
        $('.od-big strong', vizBox).textContent = kg ? (Math.round(grams / 100) / 10).toString() : grams;
        $('.od-big span', vizBox).textContent = kg ? 'kg' : 'g';
        vizNote.textContent = lines.length ? RK.packs(total) + ' across ' + lines.length + (lines.length === 1 ? ' cheese.' : ' cheeses.') : 'Mix any cheeses and sizes.';
      }
    }

    function paintRepeat(total) {
      var box = $('.od-repeat', root), last = RK.list.history().slice(-1)[0];
      if (!last || total || step !== 1) { box.hidden = true; return; }
      var n = last.lines.reduce(function (t, l) { return t + (+l.qty || 0); }, 0);
      box.innerHTML = '<span class="od-repeat__icon">' + RK.icon('repeat') + '</span><span><strong>Welcome back.</strong> Repeat your list from ' +
        esc(new Date(last.sent).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })) + ': ' + RK.packs(n) + '.</span><button class="btn btn--sm btn--ghost" type="button" data-repeat>Repeat it</button>';
      box.hidden = false;
    }

    function nextLabel() {
      var labels = { 1: 'Continue to your details', 2: 'Continue to delivery', 3: 'Review my order', 4: 'Send on WhatsApp' };
      if (step === 'done') return;
      nextBtn.innerHTML = '<span>' + labels[step] + '</span>' + RK.icon(step === 4 ? 'whatsapp' : 'right');
      nextBtn.classList.toggle('btn--wa', step === 4);
      backBtn.hidden = step === 1;
    }

    /* ---------- Steps ---------- */
    function show(n, focus) {
      step = n;
      reached = Math.max(reached, n);
      $$('.od-panel', root).forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== String(n); });
      $$('[data-goto]', root).forEach(function (b) {
        var k = +b.getAttribute('data-goto');
        b.disabled = k > reached;
        if (k === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        b.parentNode.classList.toggle('is-done', k < n || (k <= reached && k !== n));
      });
      root.setAttribute('data-step', n);
      errBox.textContent = '';
      if (n === 4) buildReview();
      paint();
      if (opts.onStep) opts.onStep(n);
      if (focus) {
        var top = root.getBoundingClientRect().top;
        if (top < 0 || top > innerHeight * .6) RK.scrollTo(root);
        var h = $('[data-panel="' + n + '"] .od-panel__title', root);
        if (h) setTimeout(function () { h.focus({ preventScroll: true }); }, RK.reducedMotion() ? 0 : 500);
      }
    }

    function check(n) {
      if (n === 1) {
        if (!RK.list.total()) { errBox.textContent = 'Add at least one cheese to continue.'; return false; }
        return true;
      }
      tried[n] = true;
      var bad = RK.validateForm(form, RULES[n]);
      if (bad) {
        var count = $$('[data-panel="' + n + '"] [aria-invalid="true"]', root).length;
        errBox.textContent = count === 1 ? 'One field needs attention.' : count + ' fields need attention.';
        bad.focus();
        return false;
      }
      return true;
    }

    function next() {
      if (step === 'done') return;
      if (!check(step)) return;
      if (step < 4) show(step + 1, true); else send(true);
    }

    function val(n) { var el = form.elements[n]; return el ? String(el.value || '').trim() : ''; }

    function details() {
      var d = val('date') ? new Date(val('date') + 'T12:00:00') : null;
      return {
        who: val('who'), name: val('name'), phone: val('phone'), email: val('email'), business: val('business'), type: val('type'),
        regular: form.elements.regular.checked, method: val('method'), area: val('area'), address: val('address'),
        date: d, time: val('time'), pay: val('pay'), notes: val('notes')
      };
    }
    function methodText(d) {
      if (d.method === 'Collect') return 'Collect from the factory shop, ' + C.street;
      return (d.method === 'Courier' ? 'Courier to ' : 'Deliver to ') + [d.address, d.area].filter(Boolean).join(', ');
    }

    function buildReview() {
      var d = details(), lines = RK.list.lines();
      var rows = function (list) {
        return '<dl>' + list.filter(function (r) { return r[1]; }).map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>';
      };
      $('.od-review', root).innerHTML =
        '<article class="od-block"><header><h4>' + RK.icon('basket') + 'Cheese</h4><button type="button" data-goto="1">' + RK.icon('edit') + 'Edit</button></header>' +
        '<ul class="od-block__lines">' + lines.map(function (l) {
          return '<li style="--c:' + l.product.color + '"><img src="' + RK.img(l.product.plate) + '" alt="" width="80" height="80"><span>' + esc(l.product.name) + '<em>' + esc(l.pack.label) + '</em></span><b>× ' + l.qty + '</b></li>';
        }).join('') + '</ul><p class="od-block__total">' + RK.packs(RK.list.total()) + ', about ' + RK.weight(RK.list.grams()) + '</p></article>' +
        '<article class="od-block"><header><h4>' + RK.icon(d.who === 'Business' ? 'briefcase' : 'home') + 'You</h4><button type="button" data-goto="2">' + RK.icon('edit') + 'Edit</button></header>' +
        rows([['Name', d.name], ['Phone', d.phone], ['Email', d.email], ['For', d.who === 'Business' ? d.business + (d.type ? ', ' + d.type : '') : 'Home'],
          ['Trade', d.regular ? 'Would like a weekly order and trade prices' : '']]) + '</article>' +
        '<article class="od-block"><header><h4>' + RK.icon('truck') + 'Delivery</h4><button type="button" data-goto="3">' + RK.icon('edit') + 'Edit</button></header>' +
        rows([['How', methodText(d)], ['Day', d.date ? longDay(d.date) : ''], ['Time', d.time], ['Payment', d.pay], ['Notes', d.notes]]) + '</article>';
    }

    function message(record, d, lines) {
      return 'Hello Raka! I would like to order:\n' + RK.listText(lines) +
        '\nTotal: ' + RK.packs(record.total) + ', about ' + RK.weight(record.grams) +
        '\n\nName: ' + d.name + '\nPhone: ' + d.phone + (d.email ? '\nEmail: ' + d.email : '') +
        '\nFor: ' + (d.who === 'Business' ? d.business + ' (' + d.type + ')' + (d.regular ? ', interested in a weekly order' : '') : 'Home') +
        '\n' + methodText(d) + (d.date ? '\nDay: ' + longDay(d.date) + ', ' + d.time.toLowerCase() : '') +
        '\nPayment: ' + d.pay + (d.notes ? '\nNotes: ' + d.notes : '') + '\nReference: ' + record.ref;
    }

    function send(viaWa) {
      if (step === 4 && !check(4)) return;
      var d = details(), lines = RK.list.lines();
      var record = {
        ref: RK.reference('RK'), sent: new Date().toISOString(), via: viaWa ? 'WhatsApp' : 'Request',
        total: RK.list.total(), grams: RK.list.grams(),
        lines: lines.map(function (l) { return { key: l.key, name: l.product.name, pack: l.pack.label, qty: l.qty }; }),
        details: Object.assign({}, d, { date: d.date ? d.date.toISOString().slice(0, 10) : '' })
      };
      var text = message(record, d, lines);
      if (viaWa) RK.openWa(text);
      $$('.od-send button, .od-next', root).forEach(function (b) { b.disabled = true; b.classList.add('is-busy'); });
      setTimeout(function () {
        RK.list.remember(record);
        sent = { record: record, d: d, lines: lines, text: text };
        RK.list.save({});
        $$('.od-send button, .od-next', root).forEach(function (b) { b.disabled = false; b.classList.remove('is-busy'); });
        done();
        if (opts.onSent) opts.onSent(record);
      }, RK.reducedMotion() ? 150 : 900);
    }

    function done() {
      var r = sent.record, d = sent.d, lines = sent.lines;
      var day = d.date ? longDay(d.date) : 'your chosen day';
      var panel = $('[data-panel="done"]', root);
      panel.innerHTML = '<div class="od-done__badge">' + RK.icon('check') + '</div>' +
        '<h3 class="od-done__title">' + (r.via === 'WhatsApp' ? 'Over to WhatsApp' : 'Order request sent') + '</h3>' +
        '<p class="od-done__lead">Thanks, ' + esc(d.name.split(' ')[0]) + '. ' + (r.via === 'WhatsApp' ? 'Your order is written out in WhatsApp: press send there and ' : '') +
        'the Raka team will confirm prices and ' + (d.method === 'Collect' ? 'your collection' : 'delivery') + ' on <strong>' + esc(d.phone) + '</strong>, then lock in ' + esc(day) + '.</p>' +
        '<dl class="od-done__meta"><div><dt>Reference</dt><dd>' + r.ref + '</dd></div><div><dt>Cheese</dt><dd>' + RK.packs(r.total) + ', ' + RK.weight(r.grams) + '</dd></div>' +
        '<div><dt>' + (d.method === 'Collect' ? 'Collection' : 'Delivery') + '</dt><dd>' + esc(shortDay(d.date || new Date())) + ', ' + esc((d.time || '').split(',')[0].toLowerCase()) + '</dd></div></dl>' +
        '<ol class="od-track">' +
        '<li class="is-done"><span></span><div><strong>Order received</strong><p>Just now, reference ' + r.ref + '</p></div></li>' +
        '<li><span></span><div><strong>Prices confirmed on WhatsApp</strong><p>The team messages ' + esc(d.phone) + '</p></div></li>' +
        '<li><span></span><div><strong>Packed chilled in Nyeri</strong><p>The morning of ' + esc(day) + '</p></div></li>' +
        '<li><span></span><div><strong>' + (d.method === 'Collect' ? 'Ready at the factory shop' : 'On your table') + '</strong><p>' + esc(d.time || '') + '</p></div></li></ol>' +
        '<ul class="od-done__lines">' + lines.map(function (l) {
          return '<li style="--c:' + l.product.color + '"><img src="' + RK.img(l.product.plate) + '" alt="" width="80" height="80"><span>' + esc(l.product.name) + '<em>' + esc(l.pack.label) + '</em></span><b>× ' + l.qty + '</b></li>';
        }).join('') + '</ul>' +
        '<div class="od-done__actions">' + (r.via === 'WhatsApp' ? '<a class="btn btn--wa" href="' + RK.wa(sent.text) + '" target="_blank" rel="noopener">' + RK.icon('whatsapp') + 'Open WhatsApp again</a>' : '<a class="btn btn--wa" href="' + RK.wa(sent.text) + '" target="_blank" rel="noopener">' + RK.icon('whatsapp') + 'Also send on WhatsApp</a>') +
        '<button class="btn btn--ghost" type="button" data-print>' + RK.icon('print') + 'Print</button>' +
        '<button class="btn btn--ghost" type="button" data-new>' + RK.icon('repeat') + 'Start a new list</button></div>';
      step = 'done';
      root.setAttribute('data-step', 'done');
      root.classList.add('is-done');
      $$('.od-panel', root).forEach(function (p) { p.hidden = p !== panel; });
      $$('[data-goto]', root).forEach(function (b) { b.disabled = true; b.removeAttribute('aria-current'); b.parentNode.classList.add('is-done'); });
      panel.focus({ preventScroll: true });
      if (root.getBoundingClientRect().top < 0) RK.scrollTo(root);
      $('.od-share', root).hidden = true;
    }

    function restart() {
      form.reset();
      tried = {};
      reached = 1;
      root.classList.remove('is-done');
      $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); });
      $$('.field__error', form).forEach(function (el) { el.textContent = ''; });
      $$('.has-error', form).forEach(function (el) { el.classList.remove('has-error'); });
      $('.od-biz', root).hidden = true;
      syncMethod();
      show(1, true);
    }

    function printOrder() {
      var r = sent.record, d = sent.d;
      var box = document.createElement('div');
      box.className = 'od-print';
      box.innerHTML = '<h1>Raka Cheese order ' + r.ref + '</h1><p>' + esc(C.legal) + ', ' + esc(C.street) + ', ' + esc(C.city) + '. WhatsApp ' + esc(C.phone) + '.</p>' +
        '<table><thead><tr><th>Cheese</th><th>Size</th><th>Packs</th></tr></thead><tbody>' + r.lines.map(function (l) { return '<tr><td>Raka ' + esc(l.name) + '</td><td>' + esc(l.pack) + '</td><td>' + l.qty + '</td></tr>'; }).join('') + '</tbody></table>' +
        '<p><strong>' + esc(d.name) + '</strong>, ' + esc(d.phone) + (d.who === 'Business' ? '<br>' + esc(d.business) + ', ' + esc(d.type) : '') + '</p>' +
        '<p>' + esc(methodText(d)) + '<br>' + esc(d.date ? longDay(d.date) : '') + ', ' + esc(d.time) + '<br>Payment: ' + esc(d.pay) + '</p>' +
        '<p>Prices and delivery are confirmed by the Raka team on WhatsApp.</p>';
      document.body.appendChild(box);
      var clean = function () { box.remove(); removeEventListener('afterprint', clean); };
      addEventListener('afterprint', clean);
      window.print();
      setTimeout(clean, 1500);
    }

    function syncMethod() {
      var m = form.elements.method.value;
      $('.od-area', root).hidden = m === 'Collect';
      $('.od-address', root).hidden = m === 'Collect';
      $('.od-day-legend', root).textContent = m === 'Collect' ? 'Collection day *' : m === 'Courier' ? 'Dispatch day *' : 'Delivery day *';
    }

    /* ---------- Events ---------- */
    root.addEventListener('click', function (e) {
      var t = e.target;
      var add = t.closest('.od-item__add');
      if (add) {
        var li = add.closest('.od-item'), id = li.getAttribute('data-id');
        var pk = $('input[name="pk-' + id + '"]:checked', li);
        RK.addToList(id, pk ? pk.value : null, 1, true);
        errBox.textContent = '';
        if (!RK.reducedMotion()) $('.od-item__img img', li).animate([{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(-24deg) scale(1.08)' }, { transform: 'rotate(0) scale(1)' }], { duration: 480, easing: 'cubic-bezier(.3,1.4,.5,1)' });
        return;
      }
      var line = t.closest('[data-line]');
      if (line) {
        var key = line.getAttribute('data-line'), dd = line.getAttribute('data-d');
        RK.list.set(key, dd === 'x' ? 0 : RK.list.qty(key) + +dd);
        return;
      }
      var go = t.closest('[data-goto]');
      if (go && !go.disabled) { show(+go.getAttribute('data-goto'), true); return; }
      var filter = t.closest('[data-filter]');
      if (filter) {
        var f = filter.getAttribute('data-filter');
        $$('[data-filter]', root).forEach(function (b) { b.setAttribute('aria-pressed', b === filter ? 'true' : 'false'); });
        $$('.od-item', root).forEach(function (li) { li.hidden = f !== 'all' && (' ' + li.getAttribute('data-moods') + ' ').indexOf(' ' + f + ' ') < 0; });
        return;
      }
      if (t.closest('[data-repeat]')) {
        var last = RK.list.history().slice(-1)[0], o = {};
        last.lines.forEach(function (l) { o[l.key] = +l.qty || 0; });
        RK.list.save(o);
        RK.toast('Your last list is back');
        return;
      }
      if (t.closest('.od-send__wa')) { send(true); return; }
      if (t.closest('.od-send__req')) { if (check(4)) send(false); return; }
      if (t.closest('.od-share')) {
        RK.openWa('Hello Raka! Here is my cheese list:\n' + RK.listText() + '\nTotal: ' + RK.packs(RK.list.total()) + ', about ' + RK.weight(RK.list.grams()) + '\n\nPlease confirm prices and delivery.');
        return;
      }
      if (t.closest('[data-print]')) { printOrder(); return; }
      if (t.closest('[data-new]')) restart();
    });
    root.addEventListener('change', function (e) {
      if (e.target.name === 'who') $('.od-biz', root).hidden = e.target.value !== 'Business';
      if (e.target.name === 'method') syncMethod();
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); next(); });
    nextBtn.addEventListener('click', next);
    backBtn.addEventListener('click', function () { if (step > 1) show(step - 1, true); });
    document.addEventListener('rk:list', function () { if (step !== 'done') paint(); });

    show(1, false);
    return {
      goTo: function (n) { if (step !== 'done' && n <= reached) show(n, true); },
      business: function () {
        var r = $('input[name="who"][value="Business"]', root);
        if (r) { r.checked = true; $('.od-biz', root).hidden = false; }
      },
      filter: function (mood) { var b = $('[data-filter="' + mood + '"]', root); if (b) b.click(); },
      restart: restart
    };
  };
})();

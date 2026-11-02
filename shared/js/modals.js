/* Pop-ups shared by both concepts: a cheese, a recipe, the founder video and a grazing board enquiry. */
(function () {
  var RK = window.RK, $ = RK.$, $$ = RK.$$, esc = RK.esc;

  function cheeseChip(id) {
    var p = RK.product(id);
    return '<button type="button" class="rk-chip" data-open-product="' + p.id + '" style="--c:' + p.color + '"><i></i>' + esc(p.name) + '</button>';
  }

  /* ---------- A cheese ---------- */
  RK.openProduct = function (id) {
    var p = RK.product(id);
    if (!p) return;
    var recipes = RK.recipes.filter(function (r) { return r.cheese.some(function (c) { return c[0] === p.id; }); });
    var moods = p.moods.map(function (m) { return RK.moods.find(function (x) { return x.id === m; }); });
    var html =
      '<article class="pm" style="--c:' + p.color + ';--tint:' + p.tint + '">' +
      '<div class="pm__media">' +
      '<img class="pm__food" src="' + RK.img(p.img) + '" alt="' + esc(p.name) + ' in use" width="1000" height="1250">' +
      (p.pack ? '<figure class="pm__pack"><img src="' + RK.img(p.pack) + '" alt="The Raka ' + esc(p.name) + ' pack" width="600" height="750"><figcaption>The real pack</figcaption></figure>' : '') +
      '</div>' +
      '<div class="pm__body">' +
      '<p class="pm__kicker"><i></i>' + esc(p.kind) + '</p>' +
      '<h2 class="pm__title">' + esc(p.name) + '</h2>' +
      '<p class="pm__desc">' + esc(p.desc) + '</p>' +
      '<div class="pm__moods">' + moods.map(function (m) { return '<span>' + RK.icon(m.icon) + esc(m.name) + '</span>'; }).join('') +
      p.uses.filter(function (u) { return !moods.some(function (m) { return m.name.toLowerCase() === u.toLowerCase(); }); })
        .map(function (u) { return '<span class="is-use">' + esc(u) + '</span>'; }).join('') + '</div>' +
      '<form class="pm__buy" data-product="' + p.id + '">' +
      '<fieldset><legend>Pick a size</legend><div class="pm__packs">' + p.packs.map(function (k, i) {
        return '<label><input type="radio" name="pack" value="' + k.id + '"' + (i === (p.def || 0) ? ' checked' : '') + '><span>' + esc(k.label) + '</span></label>';
      }).join('') + '</div></fieldset>' +
      '<div class="pm__row">' + RK.stepperHTML('pm', 1, 'How many packs') +
      '<button class="btn btn--primary pm__add" type="submit">' + RK.icon('basket') + '<span>Add to my cheese list</span></button></div>' +
      '<p class="pm__note">' + RK.icon('info') + '<span>Prices and delivery are confirmed on WhatsApp before anything is packed.</span></p>' +
      '</form>' +
      (recipes.length ? '<div class="pm__recipes"><h3>Cook it</h3><div>' + recipes.slice(0, 3).map(function (r) {
        return '<button type="button" class="pm__rec" data-open-recipe="' + r.id + '"><img src="' + RK.img(r.plate || r.img) + '" alt="" width="120" height="120"><span><strong>' + esc(r.name) + '</strong><em>' + r.mins + ' min</em></span></button>';
      }).join('') + '</div></div>' : '') +
      '<a class="pm__ask" href="' + RK.wa('Hello Raka! I have a question about ' + p.name + '.') + '" target="_blank" rel="noopener">' + RK.icon('whatsapp') + 'Ask about ' + esc(p.name) + ' on WhatsApp</a>' +
      '</div></article>';
    RK.modal.open(html, { className: 'rk-dialog--product', label: p.name, onOpen: function (d) {
      var form = $('.pm__buy', d);
      form.addEventListener('click', function (e) {
        var b = e.target.closest('[data-step]');
        if (!b) return;
        var box = b.closest('.qty');
        $('input', box).value = Math.max(1, RK.stepperValue(box) + +b.getAttribute('data-step'));
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var n = Math.max(1, RK.stepperValue($('.qty', form)));
        RK.addToList(p.id, form.elements.pack.value, n);
        var btn = $('.pm__add span', form);
        btn.textContent = 'Added. Add more?';
        setTimeout(function () { btn.textContent = 'Add to my cheese list'; }, 2200);
      });
    } });
  };

  /* ---------- A recipe ---------- */
  RK.openRecipe = function (id) {
    var r = RK.recipe(id);
    if (!r) return;
    var cheeses = r.cheese.map(function (c) { return RK.product(c[0]); });
    var html =
      '<article class="rm">' +
      '<div class="rm__media"><img src="' + RK.img(r.img) + '" alt="' + esc(r.name) + '" width="1000" height="1250">' +
      '<span class="rm__badge">' + esc(r.badge) + '</span></div>' +
      '<div class="rm__body">' +
      '<ul class="rm__meta"><li>' + RK.icon('clock') + r.mins + ' min</li><li>' + RK.icon('users') + 'Serves ' + r.serves + '</li><li>' + RK.icon(RK.moods.find(function (m) { return m.id === r.mood; }).icon) + RK.moods.find(function (m) { return m.id === r.mood; }).name + '</li></ul>' +
      '<h2 class="rm__title">' + esc(r.name) + '</h2>' +
      '<p class="rm__intro">' + esc(r.intro) + '</p>' +
      '<div class="rm__cheese">' + cheeses.map(function (p) { return cheeseChip(p.id); }).join('') + '</div>' +
      '<div class="rm__cols">' +
      '<section><h3>You need</h3><ul class="rm__ing">' + r.ingredients.map(function (x, i) {
        return '<li><label><input type="checkbox"><span>' + esc(x) + '</span></label></li>';
      }).join('') + '</ul></section>' +
      '<section><h3>Method</h3><ol class="rm__steps">' + r.method.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></section></div>' +
      '<p class="rm__tip">' + RK.icon('sparkle') + '<span><strong>Raka tip.</strong> ' + esc(r.tip) + '</span></p>' +
      '<div class="rm__actions"><button type="button" class="btn btn--primary" data-add-recipe>' + RK.icon('basket') + '<span>Add the cheese to my list</span></button>' +
      '<a class="btn btn--wa" href="' + RK.wa('Hello Raka! Please send me the cheese for ' + r.name + ':\n' + r.cheese.map(function (c) { var p = RK.product(c[0]); var k = p.packs.find(function (x) { return x.id === c[1]; }); return '• ' + c[2] + ' × ' + p.name + ', ' + k.label; }).join('\n')) + '" target="_blank" rel="noopener">' + RK.icon('whatsapp') + '<span>Order it on WhatsApp</span></a></div>' +
      '</div></article>';
    RK.modal.open(html, { className: 'rk-dialog--recipe', label: r.name, onOpen: function (d) {
      $('[data-add-recipe]', d).addEventListener('click', function () {
        r.cheese.forEach(function (c) { RK.addToList(c[0], c[1], c[2], true); });
        RK.toast('The cheese for ' + r.name + ' is on your list', { label: 'View list', run: function () { RK.go('#order'); } });
      });
    } });
  };

  /* ---------- The founder video (self-hosted, with sound) ---------- */
  RK.openVideo = function () {
    var html = '<div class="vm"><video src="' + RK.media('video/founder.mp4') + '" poster="' + RK.media('video/founder.webp') + '" controls autoplay playsinline preload="metadata"></video>' +
      '<p class="vm__cap"><strong>Welcome to our world.</strong> Kalpa Kapasi Padia, founder, owner and managing director of Raka Cheese, from Raka’s Facebook page.</p></div>';
    RK.modal.open(html, { className: 'rk-dialog--video', label: 'Welcome to our world, with Kalpa Kapasi Padia' });
  };

  /* ---------- Grazing board enquiry: writes a WhatsApp message ---------- */
  RK.openBoard = function (id) {
    var b = RK.boards.find(function (x) { return x.id === id; }) || RK.boards[1];
    var min = new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10);
    var html =
      '<div class="bm"><div class="bm__media"><img src="' + RK.img(b.img) + '" alt="A Raka grazing board" width="900" height="1125"><p>Kalpa’s Grazing Atelier</p></div>' +
      '<form class="bm__form" novalidate><p class="bm__kicker">Luxury grazing, designed with heart</p><h2>Book a board</h2>' +
      '<fieldset class="field field--full"><legend>Which board?</legend><div class="bm__opts">' + RK.boards.map(function (x) {
        return '<label><input type="radio" name="board" value="' + x.id + '"' + (x.id === b.id ? ' checked' : '') + '><span><strong>' + esc(x.name.replace('The ', '')) + '</strong><em>' + esc(x.guests) + ' guests</em></span></label>';
      }).join('') + '</div></fieldset>' +
      '<div class="field"><label for="bm-occ">Occasion</label><select id="bm-occ" name="occasion">' + RK.optionsHTML(RK.occasions, 'Choose an occasion') + '</select></div>' +
      '<div class="field"><label for="bm-date">Date *</label><input id="bm-date" name="date" type="date" min="' + min + '"></div>' +
      '<div class="field"><label for="bm-name">Your name *</label><input id="bm-name" name="name" autocomplete="name"></div>' +
      '<div class="field"><label for="bm-phone">Phone *</label><input id="bm-phone" name="phone" type="tel" autocomplete="tel" placeholder="0712 345 678"></div>' +
      '<div class="field field--full"><label for="bm-notes">Anything we should know?</label><textarea id="bm-notes" name="notes" rows="2" placeholder="Venue, dietary needs, colours, a theme"></textarea></div>' +
      '<button class="btn btn--wa bm__send" type="submit">' + RK.icon('whatsapp') + '<span>Send on WhatsApp</span></button>' +
      '<p class="bm__note">This opens WhatsApp with your request written out. Kalpa confirms the menu and the price.</p></form></div>';
    RK.modal.open(html, { className: 'rk-dialog--board', label: 'Book a grazing board', onOpen: function (d) {
      var form = $('form', d), tried = false;
      var rules = { date: RK.rules.required('Pick the date of your event.'), name: RK.rules.name, phone: RK.rules.phone };
      RK.liveValidate(form, rules, function () { return tried; });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        tried = true;
        var bad = RK.validateForm(form, rules);
        if (bad) { bad.focus(); return; }
        var x = RK.boards.find(function (k) { return k.id === form.elements.board.value; });
        var when = new Date(form.elements.date.value + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
        var msg = 'Hello Kalpa! I would like to book a grazing board.\n\n' +
          '• Board: ' + x.name.replace('The ', '') + ' (' + x.guests + ' guests)\n' +
          (form.elements.occasion.value ? '• Occasion: ' + form.elements.occasion.value + '\n' : '') +
          '• Date: ' + when + '\n• Name: ' + form.elements.name.value.trim() + '\n• Phone: ' + form.elements.phone.value.trim() +
          (form.elements.notes.value.trim() ? '\n• Notes: ' + form.elements.notes.value.trim() : '');
        RK.openWa(msg);
        RK.modal.close(d);
        RK.toast('WhatsApp is open with your board request');
      });
    } });
  };

  /* Any element with data-open-* opens the matching pop-up */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open-product],[data-open-recipe],[data-open-video],[data-open-board],[data-add]');
    if (!t) return;
    e.preventDefault();
    if (t.hasAttribute('data-open-product')) RK.openProduct(t.getAttribute('data-open-product'));
    else if (t.hasAttribute('data-open-recipe')) RK.openRecipe(t.getAttribute('data-open-recipe'));
    else if (t.hasAttribute('data-open-video')) RK.openVideo();
    else if (t.hasAttribute('data-open-board')) RK.openBoard(t.getAttribute('data-open-board'));
    else if (t.hasAttribute('data-add')) {
      var parts = t.getAttribute('data-add').split('|');
      RK.addToList(parts[0], parts[1] || null, 1);
    }
  });
})();

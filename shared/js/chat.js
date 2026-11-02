/* Raka on WhatsApp: a chat that looks and feels like WhatsApp, answers from the site's own
   content, builds a cheese list, and hands the conversation to the real WhatsApp number. Rule based, no server. */
(function () {
  var RK = window.RK, $ = RK.$, $$ = RK.$$, esc = RK.esc;
  var C = RK.company;

  var CHIPS = [
    { label: 'See the range', say: 'What cheeses do you make?' },
    { label: 'Recipe ideas', say: 'Give me a recipe idea' },
    { label: 'Order cheese', say: 'I want to order cheese' },
    { label: 'Grazing boards', say: 'Tell me about grazing boards' },
    { label: 'Delivery', say: 'Do you deliver?' }
  ];

  function strip(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9.\s]/g, ' '); }

  var CHEESE_WORDS = {
    mozzarella: /mozz?a?rell?a|\bmozz\b|stretchy/, pizza: /pizza cheese|for pizza|\bpizza\b/, cheddar: /chedd?ar|cheder/,
    paneer: /paneer|panir/, halloumi: /hall?oum?i|halumi|grilling cheese/, feta: /\bfeta\b/, 'nyeri-blue': /nyeri blue|blue cheese|\bblue\b/,
    gouda: /gouda/, brie: /\bbrie\b/, 'cream-cheese': /cream cheese|creamcheese|cheesecake|spread/
  };

  var INTENTS = [
    { id: 'person', re: /\b(person|human|someone|agent|real|staff|kalpa)\b|talk to|speak to|call me/ },
    { id: 'list', re: /my list|my cart|my basket|my order|what.*in (my )?(list|cart|basket)|show list|view list/ },
    { id: 'add', re: /\badd\b|\bnataka\b|i want|i ll take|ill take|give me|put .* in|\bbuy\b/ },
    { id: 'trade', re: /hotel|restaurant|bulk|wholesale|supplier|supply|distribut|pizzeria|cater|trade|business|stockist|large order|kg a week|weekly order|school/ },
    { id: 'boards', re: /board|grazing|platter|party|wedding|birthday|corporate|hamper|gift|shower|event|atelier/ },
    { id: 'price', re: /price|cost|how much|\bbei\b|rate|cheap|expensive|ksh|shilling/ },
    { id: 'delivery', re: /deliver|courier|shipping|ship|send to|nairobi|mombasa|kisumu|nakuru|eldoret|thika|nanyuki|town|county|kuleta|peleka/ },
    { id: 'order', re: /order|checkout|purchase|nunua|place an order/ },
    { id: 'stockists', re: /supermarket|carrefour|naivas|quickmart|chandarana|shop near|in store|stockist|find raka|where (can|do) i (buy|get)/ },
    { id: 'hours', re: /open|hours|closing|\bclose\b|what time|\bsaa\b|weekend|sunday|saturday/ },
    { id: 'where', re: /where|location|locat|address|factory|visit|direction|\bmap\b|rware|nyeri|wapi/ },
    { id: 'recipes', re: /recipe|cook|make with|idea|dinner|lunch|breakfast|curry|salad|bbq|braai|grill|sandwich|toastie|pasta|snack|ugali|chapati|melt/ },
    { id: 'veg', re: /vegetarian|veg\b|rennet|halal|animal|vegan|ingredient|kebs|certif/ },
    { id: 'lactose', re: /lactose|intoleran|allerg|gluten|diet|healthy|calorie|protein/ },
    { id: 'storage', re: /store|keep|fridge|freez|shelf life|expir|how long|last/ },
    { id: 'story', re: /who are you|about|founder|rajesh|history|since|started|name raka|meaning|story|family|owner/ },
    { id: 'social', re: /instagram|insta|facebook|\bfb\b|social|follow|tiktok|youtube/ },
    { id: 'contact', re: /contact|phone|\bcall\b|number|email|whatsapp|reach/ },
    { id: 'range', re: /range|cheeses|products|what do you (make|sell|have)|types|kinds|aina|menu|catalog/ },
    { id: 'thanks', re: /thank|asante|\bthx\b|great|perfect|\bcool\b|\bok\b|okay|nice|sawa/ },
    { id: 'bye', re: /\bbye\b|goodbye|kwaheri|see you|later/ },
    { id: 'greet', re: /\b(hi|hello|hey|hola|jambo|habari|mambo|sasa|niaje|hujambo|good (morning|afternoon|evening))\b/ }
  ];

  function cheeseIn(s) {
    var hit = null;
    Object.keys(CHEESE_WORDS).forEach(function (id) {
      if (hit) return;
      if (id === 'pizza' && /mozz/.test(s)) return;
      if (CHEESE_WORDS[id].test(s)) hit = id;
    });
    return hit;
  }
  function qtyIn(s) {
    var m = s.match(/\b(\d{1,2})\s*(x|packs?|pcs|pieces|of)?\b(?!\s*(g|kg|gram))/);
    var words = { one: 1, two: 2, three: 3, four: 4, five: 5, moja: 1, mbili: 2, tatu: 3, nne: 4, tano: 5 };
    if (m) return Math.min(+m[1], 50);
    var w = Object.keys(words).find(function (k) { return new RegExp('\\b' + k + '\\b').test(s); });
    return w ? words[w] : 1;
  }
  function packIn(p, s) {
    var size = s.match(/(\d+(?:\.\d+)?)\s*(kg|g|gram)/);
    if (size) {
      var g = size[2] === 'kg' ? +size[1] * 1000 : +size[1];
      var k = p.packs.find(function (x) { return x.g === g; });
      if (k) return k;
    }
    if (/slice/.test(s)) return p.packs.find(function (x) { return x.id === 'slices'; }) || null;
    if (/grat/.test(s)) return p.packs.find(function (x) { return x.id === 'grated'; }) || null;
    if (/jar|marinat/.test(s)) return p.packs.find(function (x) { return x.id === 'jar'; }) || null;
    if (/garlic/.test(s)) return p.packs.find(function (x) { return x.id === 'garlic'; }) || null;
    if (/pepper/.test(s)) return p.packs.find(function (x) { return x.id === 'pepper'; }) || null;
    return null;
  }

  function listSummary() {
    var lines = RK.list.lines();
    if (!lines.length) return '';
    return lines.map(function (l) { return l.qty + ' × ' + l.product.name + ' ' + l.pack.label; }).join('\n') + '\nTotal: ' + RK.packs(RK.list.total()) + ', about ' + RK.weight(RK.list.grams());
  }

  function reply(intent, ctx, raw) {
    var waList = { label: 'Send my list on WhatsApp', act: 'wa-list' };
    var desk = { label: 'Open my cheese list', act: 'order' };
    var person = { label: 'Chat with the team', act: 'wa-person' };
    switch (intent) {
      case 'greet':
        return { text: 'Habari! 👋 Welcome to Raka Cheese, made in the Nyeri highlands since 2001. I can show you the range, find a recipe, build your order or book a grazing board. What would you like?', chips: CHIPS };
      case 'range':
        return { text: 'Here is the Raka family: ten cheeses, all made for vegetarians. Tap one for details or add it straight to your list.', products: RK.products.map(function (p) { return p.id; }) };
      case 'product':
        var p = RK.product(ctx);
        return { text: 'Raka ' + p.name + ': ' + p.desc + '\n\nSizes: ' + p.packs.map(function (k) { return k.label; }).join(', ') + '.', products: [p.id], chips: [{ label: 'Recipes with ' + p.short, say: 'recipe with ' + p.name }, { label: 'Order cheese', say: 'I want to order' }] };
      case 'add':
        var pr = RK.product(ctx);
        if (!pr) return { text: 'Which cheese would you like to add? Tap one below.', products: RK.products.map(function (x) { return x.id; }) };
        var s = strip(raw || ''), n = qtyIn(s), pk = packIn(pr, s) || pr.packs[pr.def || 0];
        RK.addToList(pr.id, pk.id, n, true);
        return { text: 'Done ✅ ' + n + ' × ' + pr.name + ', ' + pk.label + ' is on your list.\n\n' + listSummary(), actions: [waList, desk], chips: [{ label: 'Add another cheese', say: 'What cheeses do you make?' }] };
      case 'list':
        var sum = listSummary();
        return sum ? { text: 'Your cheese list:\n' + sum, actions: [waList, desk] } : { text: 'Your list is empty for now. Shall I show you the range?', chips: [{ label: 'See the range', say: 'What cheeses do you make?' }] };
      case 'order':
        var has = RK.list.total();
        return { text: has ? 'Lovely. You have ' + RK.packs(has) + ' on your list. Send it to the team on WhatsApp and they will confirm prices and the delivery day, or finish the order form on the page.' : 'Easy: pick your cheeses and sizes, tell us where to deliver, and the Raka team confirms prices and the day on WhatsApp. Start by choosing a cheese.', actions: has ? [waList, desk] : [desk], products: has ? null : ['mozzarella', 'cheddar', 'paneer', 'halloumi'] };
      case 'price':
        return { text: 'Prices depend on the size and how much you order, and trade customers get trade prices. Send your list and the team replies with today’s prices on WhatsApp before anything is packed.', actions: RK.list.total() ? [waList, person] : [desk, person] };
      case 'delivery':
        return { text: 'Yes! Cheese travels chilled. We deliver around Nyeri and Nanyuki, and send to Nairobi and other towns by courier in a cool box. Collection from the factory shop on the Nyeri–Nanyuki road works too. Pick a day when you order and the team confirms it.', actions: [desk], chips: [{ label: 'Where is the factory?', say: 'Where are you located?' }] };
      case 'where':
        return { text: 'You will find us at ' + C.street + ', ' + C.city + '. Postal address: ' + C.pobox + '.', location: true, chips: [{ label: 'Opening hours', say: 'What time are you open?' }] };
      case 'hours':
        var st = RK.openState();
        return { text: (st.open ? 'We are open right now. ' + st.sub + '.' : 'We are closed right now. ' + st.sub + '.') + '\n\n' + C.hours.map(function (h) { return h[0] + ': ' + h[1]; }).join('\n'), location: true };
      case 'stockists':
        return { text: 'Raka is in well-stocked supermarkets and speciality shops around Kenya, and on the Carrefour app. Can’t find it near you? Order direct and we deliver chilled.', actions: [desk, person] };
      case 'recipes':
        var c = cheeseIn(strip(raw || ''));
        var recs = RK.recipes.filter(function (r) { return !c || r.cheese.some(function (x) { return x[0] === c; }); });
        if (!recs.length) recs = RK.recipes;
        return { text: c ? 'Here is what to cook with Raka ' + RK.product(c).name + ':' : 'Hungry? Pick one: each recipe can add its cheese to your list in one tap.', recipes: recs.slice(0, 6).map(function (r) { return r.id; }) };
      case 'boards':
        return { text: 'Kalpa’s Grazing Atelier makes luxury grazing boards for birthdays, corporate events, showers and wine evenings, from a date-night board for 2 to a grazing table for 30 and more. Fresh, elegant and made to order.', boards: true };
      case 'trade':
        return { text: 'We supply hotels, restaurants, pizzerias, caterers and shops by the block: mozzarella and pizza cheese in 2.5 kg blocks, cheddar, paneer and more. Tell us what you cook and roughly how much a week, and we will quote trade prices and set a delivery day.', actions: [{ label: 'Start a trade order', act: 'trade' }, person] };
      case 'veg':
        return { text: 'All Raka cheeses are made for vegetarians: you’ll see “Suitable for vegetarians” and the KEBS mark on our labels. Our halloumi, for example, is purely vegetarian and set with rennet, with no acid used. For anything more specific, ask the team.', actions: [person] };
      case 'lactose':
        return { text: 'Aged cheeses like cheddar and gouda keep very little lactose, while fresh ones like paneer and cream cheese have a little more. One customer with lactose intolerance enjoyed ours at the Peponi art fair. If you are sensitive, start small, and ask your doctor if unsure.', chips: [{ label: 'Tell me about cheddar', say: 'cheddar' }] };
      case 'storage':
        return { text: 'Keep Raka cheese in the fridge at about 4°C, as it says on the pack. Once open, wrap it tightly: fresh cheeses like paneer and feta are best within a week, firmer ones like cheddar and gouda last a few weeks. Keep feta in its brine or oil.' };
      case 'story':
        return { text: 'Raka is two names: RA for Rajesh and KA for Kalpa Padia. They started making cheese in Nyeri in 2001. Today Kalpa Kapasi Padia, founder, owner and managing director, carries the family legacy on. #NoOneDoesItLikeRaka', actions: [{ label: 'Watch Kalpa’s welcome', act: 'video' }] };
      case 'social':
        return { text: 'Follow Raka for recipes, events and new cheeses:', actions: RK.socials.map(function (x) { return { label: x.name + ' · ' + x.handle, href: x.href }; }) };
      case 'contact':
      case 'person':
        return { text: 'The Raka team is on WhatsApp at ' + C.phone + ', and on email at ' + C.email + '. Tap below and I will pass our chat over to a person.', actions: [person, { label: 'Call ' + C.phone, href: C.phoneHref }, { label: 'Email us', href: C.emailHref }] };
      case 'thanks':
        return { text: 'Karibu sana! Anything else? 🧀', chips: CHIPS };
      case 'bye':
        return { text: 'Kwaheri! Remember: don’t say cheese, say Raka. 😄' };
      default:
        return { text: 'I’m not sure about that one yet. I can help with the range, recipes, orders, delivery and grazing boards, or pass you to a person.', chips: CHIPS, actions: [person] };
    }
  }

  function understand(text) {
    var s = strip(text);
    var cheese = cheeseIn(s);
    // "Nyeri Blue" is a cheese, not a question about Nyeri
    var rest = cheese === 'nyeri-blue' ? s.replace(/nyeri blue|blue cheese/g, ' ') : s;
    var hit = INTENTS.find(function (i) { return i.re.test(rest); });
    if (hit && hit.id === 'add') return reply('add', cheese, text);
    if (cheese && hit && hit.id === 'recipes') return reply('recipes', cheese, text);
    if (cheese && (!hit || ['range', 'greet', 'thanks', 'story', 'price', 'order'].indexOf(hit.id) > -1)) {
      if (hit && hit.id === 'order') return reply('add', cheese, text);
      return reply('product', cheese);
    }
    return reply(hit ? hit.id : 'fallback', null, text);
  }

  function clock() { return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }

  RK.chat = {
    init: function (cfg) {
      cfg = cfg || {};
      var root = document.createElement('div');
      root.className = 'wa';
      root.innerHTML =
        '<div class="wa__teaser" hidden><button class="wa__teaser-text" type="button"><span class="wa__teaser-av"><img src="' + RK.img('logo/raka-mark.webp') + '" alt=""></span>' +
        '<span><strong>Raka Cheese</strong>' + esc(cfg.teaser || 'Habari! 👋 Hungry? Ask me about cheese, recipes or delivery.') + '</span></button>' +
        '<button class="wa__teaser-x" type="button" aria-label="Dismiss">' + RK.icon('close') + '</button></div>' +
        '<section class="wa__panel" id="wa-panel" data-lenis-prevent aria-label="Chat with Raka Cheese" hidden>' +
        '<header class="wa__head"><span class="wa__av"><img src="' + RK.img('logo/raka-mark.webp') + '" alt=""></span>' +
        '<span class="wa__who"><strong>Raka Cheese</strong><span class="wa__status">online</span></span>' +
        '<a class="wa__head-btn" href="' + C.phoneHref + '" aria-label="Call Raka Cheese">' + RK.icon('phone') + '</a>' +
        '<button class="wa__head-btn wa__close" type="button" aria-label="Close chat">' + RK.icon('close') + '</button></header>' +
        '<div class="wa__log" role="log" aria-live="polite" aria-relevant="additions">' +
        '<p class="wa__day">Today</p>' +
        '<p class="wa__sys">' + RK.icon('info') + 'Answers come from Raka’s cheese assistant. Tap “Continue on WhatsApp” any time to reach a person.</p></div>' +
        '<form class="wa__form"><span class="wa__emoji" aria-hidden="true">' + RK.icon('smile') + '</span><label class="visually-hidden" for="wa-input">Message</label>' +
        '<input id="wa-input" type="text" autocomplete="off" maxlength="300" placeholder="Message">' +
        '<button type="submit" class="wa__send" aria-label="Send">' + RK.icon('send') + '</button></form>' +
        '<a class="wa__continue" target="_blank" rel="noopener" href="' + RK.wa() + '">' + RK.icon('whatsapp') + 'Continue on WhatsApp</a>' +
        '</section>' +
        '<button class="wa__launcher" type="button" aria-expanded="false" aria-controls="wa-panel" aria-label="Chat with Raka on WhatsApp">' +
        RK.icon('whatsapp') + '<span class="wa__badge">1</span></button>';
      document.body.appendChild(root);

      var panel = $('.wa__panel', root), log = $('.wa__log', root), launcher = $('.wa__launcher', root);
      var input = $('#wa-input', root), teaser = $('.wa__teaser', root), status = $('.wa__status', root), cont = $('.wa__continue', root);
      var started = false, transcript = [];

      function down() { log.scrollTop = log.scrollHeight; }
      function updateContinue() {
        var last = transcript.slice(-4).join('\n');
        var sum = listSummary();
        cont.href = RK.wa('Hello Raka! ' + (sum ? 'My cheese list:\n' + sum + '\n\n' : '') + (last ? 'From the website chat:\n' + last : 'I have a question.'));
      }

      function addUser(text) {
        var m = document.createElement('div');
        m.className = 'wa-msg wa-msg--out';
        m.innerHTML = '<p>' + esc(text) + '</p><span class="wa-msg__meta">' + clock() + '<i class="wa-msg__ticks">' + RK.icon('checks') + '</i></span>';
        log.appendChild(m);
        transcript.push('Me: ' + text);
        down();
        setTimeout(function () { m.classList.add('is-read'); }, 700);
      }

      function card(p) {
        return '<div class="wa-card" style="--c:' + p.color + '"><button type="button" class="wa-card__img" data-p="' + p.id + '"><img src="' + RK.img(p.plate) + '" alt=""></button>' +
          '<strong>' + esc(p.name) + '</strong><span>' + esc(p.kind) + '</span>' +
          '<span class="wa-card__btns"><button type="button" data-wa-add="' + p.id + '">' + RK.icon('plus') + 'Add</button><button type="button" data-p="' + p.id + '">Details</button></span></div>';
      }

      function renderBot(r) {
        var m = document.createElement('div');
        m.className = 'wa-msg wa-msg--in';
        var html = '<p>' + esc(r.text).replace(/\n/g, '<br>') + '</p>';
        if (r.location) {
          html += '<a class="wa-loc" href="' + C.maps + '" target="_blank" rel="noopener"><span class="wa-loc__map">' + RK.icon('pin') + '</span><span><strong>Raka Milk Processors Ltd</strong>' + esc(C.street) + ', Nyeri</span></a>';
        }
        html += '<span class="wa-msg__meta">' + clock() + '</span>';
        m.innerHTML = html;
        log.appendChild(m);
        transcript.push('Raka: ' + r.text.split('\n')[0].slice(0, 140));
        if (r.products) {
          var row = document.createElement('div');
          row.className = 'wa-cards';
          row.innerHTML = r.products.map(function (id) { return card(RK.product(id)); }).join('');
          log.appendChild(row);
        }
        if (r.recipes) {
          var rr = document.createElement('div');
          rr.className = 'wa-cards wa-cards--rec';
          rr.innerHTML = r.recipes.map(function (id) {
            var x = RK.recipe(id);
            return '<div class="wa-card"><button type="button" class="wa-card__img" data-r="' + x.id + '"><img src="' + RK.img(x.plate || x.img) + '" alt=""></button><strong>' + esc(x.name) + '</strong><span>' + x.mins + ' min · serves ' + x.serves + '</span>' +
              '<span class="wa-card__btns"><button type="button" data-r="' + x.id + '">Recipe</button><button type="button" data-rc="' + x.id + '">' + RK.icon('plus') + 'Cheese</button></span></div>';
          }).join('');
          log.appendChild(rr);
        }
        if (r.boards) {
          var b = document.createElement('div');
          b.className = 'wa-cards';
          b.innerHTML = RK.boards.map(function (x) {
            return '<div class="wa-card"><button type="button" class="wa-card__img wa-card__img--sq" data-b="' + x.id + '"><img src="' + RK.img(x.img) + '" alt=""></button><strong>' + esc(x.name.replace('The ', '')) + '</strong><span>' + esc(x.guests) + ' guests</span>' +
              '<span class="wa-card__btns"><button type="button" data-b="' + x.id + '">Book this board</button></span></div>';
          }).join('');
          log.appendChild(b);
        }
        if (r.actions) {
          var acts = document.createElement('div');
          acts.className = 'wa-acts';
          acts.innerHTML = r.actions.map(function (a, i) {
            if (a.href) return '<a href="' + a.href + '" target="_blank" rel="noopener">' + esc(a.label) + '</a>';
            return '<button type="button" data-i="' + i + '">' + esc(a.label) + '</button>';
          }).join('');
          $$('button', acts).forEach(function (btn) { btn.addEventListener('click', function () { act(r.actions[+btn.getAttribute('data-i')]); }); });
          log.appendChild(acts);
        }
        if (r.chips) renderChips(r.chips);
        updateContinue();
        down();
      }

      function renderChips(chips) {
        var old = $('.wa-chips', log);
        if (old) old.remove();
        var c = document.createElement('div');
        c.className = 'wa-chips';
        chips.forEach(function (ch) {
          var b = document.createElement('button');
          b.type = 'button';
          b.textContent = ch.label;
          b.addEventListener('click', function () { ask(ch.say); });
          c.appendChild(b);
        });
        log.appendChild(c);
      }

      function botSay(r) {
        status.textContent = 'typing…';
        var t = document.createElement('div');
        t.className = 'wa-msg wa-msg--in wa-msg--typing';
        t.setAttribute('aria-label', 'Raka is typing');
        t.innerHTML = '<i></i><i></i><i></i>';
        log.appendChild(t);
        down();
        setTimeout(function () { t.remove(); status.textContent = 'online'; renderBot(r); }, RK.reducedMotion() ? 120 : 650 + Math.min(r.text.length * 5, 900));
      }

      function ask(text, forced) {
        var old = $('.wa-chips', log);
        if (old) old.remove();
        addUser(text);
        botSay(forced || understand(text));
      }

      function act(a) {
        if (a.act === 'order') { close(); RK.go('#order'); }
        else if (a.act === 'trade') { close(); if (RK.desk) RK.desk.business(); RK.go('#order'); }
        else if (a.act === 'video') { RK.openVideo(); }
        else if (a.act === 'wa-list') {
          RK.openWa('Hello Raka! Here is my cheese list:\n' + RK.listText() + '\nTotal: ' + RK.packs(RK.list.total()) + ', about ' + RK.weight(RK.list.grams()) + '\n\nPlease confirm prices and delivery.');
        } else if (a.act === 'wa-person') {
          updateContinue();
          window.open(cont.href, '_blank', 'noopener');
        }
      }

      log.addEventListener('click', function (e) {
        var t = e.target.closest('button');
        if (!t) return;
        if (t.hasAttribute('data-wa-add')) {
          var p = RK.product(t.getAttribute('data-wa-add'));
          ask('Add ' + p.name, reply('add', p.id, 'add ' + p.name));
        } else if (t.hasAttribute('data-p')) RK.openProduct(t.getAttribute('data-p'));
        else if (t.hasAttribute('data-r')) RK.openRecipe(t.getAttribute('data-r'));
        else if (t.hasAttribute('data-rc')) {
          var r = RK.recipe(t.getAttribute('data-rc'));
          r.cheese.forEach(function (c) { RK.addToList(c[0], c[1], c[2], true); });
          botSay({ text: 'The cheese for ' + r.name + ' is on your list ✅\n\n' + listSummary(), actions: [{ label: 'Send my list on WhatsApp', act: 'wa-list' }, { label: 'Open my cheese list', act: 'order' }] });
        } else if (t.hasAttribute('data-b')) RK.openBoard(t.getAttribute('data-b'));
      });

      function open() {
        panel.hidden = false;
        teaser.hidden = true;
        root.classList.add('is-open');
        launcher.setAttribute('aria-expanded', 'true');
        try { sessionStorage.setItem('rk-chat-seen', '1'); } catch (e) { /* ignore */ }
        if (!started) {
          started = true;
          botSay({ text: cfg.greeting || 'Habari! 👋 I’m Raka’s cheese assistant. I can show you the range, find a recipe, build your order or book a grazing board.', chips: CHIPS });
        }
        setTimeout(function () { input.focus(); }, 60);
      }
      function close() {
        root.classList.remove('is-open');
        launcher.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      }

      launcher.addEventListener('click', function () { if (panel.hidden) open(); else close(); });
      $('.wa__close', root).addEventListener('click', function () { close(); launcher.focus(); });
      panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); launcher.focus(); } });
      $('.wa__form', root).addEventListener('submit', function (e) {
        e.preventDefault();
        var v = input.value.trim();
        if (!v) return;
        input.value = '';
        ask(v);
      });
      $('.wa__teaser-text', root).addEventListener('click', open);
      $('.wa__teaser-x', root).addEventListener('click', function () {
        teaser.hidden = true;
        try { sessionStorage.setItem('rk-chat-seen', '1'); } catch (e) { /* ignore */ }
      });
      var seen = false;
      try { seen = sessionStorage.getItem('rk-chat-seen') === '1'; } catch (e) { /* ignore */ }
      if (!seen) setTimeout(function () { if (panel.hidden) teaser.hidden = false; }, cfg.teaserDelay || 5000);

      RK.chat.open = open;
      RK.chat.close = close;
      RK.chat.ask = function (text) { open(); setTimeout(function () { ask(text); }, started ? 50 : 1400); };
    }
  };
})();

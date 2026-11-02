# Raka Cheese: website concepts

Two concept websites for **Raka Cheese** (Raka Milk Processors Ltd), makers of finest Kenyan cheese in the Nyeri highlands since 2001. Both speak to home cooks and to trade buyers (pizzerias, hotels, caterers, shops).

| | Concept | Folder | Follows | Look |
|---|---|---|---|---|
| A | Editorial | `site-a-editorial/` | [Santo Mare](https://stupendous-monstera-021684.framer.app/), made bright | Archivo condensed capitals and DM Mono labels on cream, square red buttons, full-bleed bands in blue, red, green and butter. A cheese-pull video hero, a cheese drip band, a range list that swaps the picture as you point, three melt videos, a pinned "Pass the plate" parade of turning recipe plates, a five-mood film, the founder story, grazing boards, trade, the order desk, the map and socials |
| B | Fun | `site-b-fun/` | [Ruota](https://ruota-template.framer.website/) and [Palazzo](https://palazzo.framer.website/), made sunny | Bricolage Grotesque and DM Sans on Raka yellow, tomato and cream, big rounded cards. "Ra [turning margherita] ka" hero with floating cheese, a wooden board you spin to meet ten cheeses, headlines with pictures inside, stacked recipe cards, oven steam you wipe away, a live open sign, polaroids |

`index.html` at the root is a chooser that links to both.

**Live:** https://23f3000111.github.io/rakacheese-concepts/

## In both concepts

- **The cheese list** (`shared/js/order.js`), the "shopping list" ordering flow in four steps:
  1. Pick cheese: all ten, filterable by mood (melt, grill, crumble, spread, share), each with its pack sizes. The summary shows a weight bar (A) or a round cheese board that fills slice by slice (B).
  2. About you: home or business. Business adds the business name, type and a "standing weekly order and trade prices" option.
  3. Delivery: delivered chilled around Nyeri and Nanyuki, courier to other towns in a cool box, or collection from the factory shop. Day (next eight days, no Sundays), morning or afternoon, payment preference.
  4. Review with edit links, consent, then **Send on WhatsApp** (opens WhatsApp with the whole order written out) or **Send as a request**. The confirmation shows a reference, a four-stage tracker, print and "start a new list".
  The list survives a reload, the header badge counts packs, a returning visitor can repeat the last order, and "Just send my list on WhatsApp" works at any step. Pop-ups, recipes, the chat and the turning board all add to the same list.
- **Chat assistant** (`shared/js/chat.js`) dressed as WhatsApp: green header, "online" and "typing…", ticks that turn blue, wallpaper, product and recipe cards, a location bubble, quick replies. Rule based with no server. It understands typed orders ("add 3 paneer", "two 1kg mozzarella"), questions about delivery, hours (live, in Nyeri time), prices, trade, grazing boards, storage, vegetarian and lactose, the Raka story, and Swahili greetings. "Continue on WhatsApp" hands the conversation and the list to the real number.
- **Pop-ups** (`shared/js/modals.js`): every cheese (food photo, the real Raka pack, sizes, quantity, recipes that use it), every recipe (ingredients you can tick off, method, a Raka tip, "add the cheese to my list", "order it on WhatsApp"), Kalpa's welcome video, and a grazing board enquiry that writes a WhatsApp message.
- **Twelve recipes** (`RK.recipes` in `shared/js/data.js`): cheesy ugali fritters, pizza night margherita, chapati quesadilla, grilled cheese and tomato soup, baked mac and cheese, palak paneer, paneer tikka skewers, paneer makhani, grilled halloumi, watermelon and feta salad, Nyeri Blue dip, strawberry cheesecake.
- **Kalpa's Grazing Atelier**: four boards (date night, family, party, grazing table) with an enquiry form.
- **Kalpa's welcome video** (Raka's own Facebook reel, self-hosted with sound in the pop-up), Google Maps embed of Raka Milk Processors Ltd, directions link, live open or closed status, Instagram, Facebook and WhatsApp links in the header, footer, social sections and chat.
- **Motion**: GSAP with ScrollTrigger and SplitText, Lenis smooth scrolling (wheel only). Split-line and letter reveals, clip-path image wipes, scrubbed parallax, a pinned horizontal plate parade (A), a draggable board with flick and snap (B), stacked cards (B), magnetic buttons, a velocity-aware marquee, hover tilts. `prefers-reduced-motion` turns it off and everything stays visible.
- Sans-serif only, light and bright throughout, laptop first (checked at 1440 × 900).

## Orders and forms have no inbox yet

GitHub Pages cannot receive posts, so orders are handed to WhatsApp (the real number, 0722 375 630) and also kept in the visitor's browser (`localStorage`: `rk-orders`, with the draft list in `rk-list-draft`). "Send as a request" only stores locally. To receive requests by email or in a sheet, point `send()` in `shared/js/order.js` at a form service such as Formspree or Web3Forms with a `fetch()` POST of `record`. The newsletter box on B only validates the address.

## What is real and what to confirm with the client

**Real (from Raka's own material):** the logo and "finest Kenyan Cheese" (cut from Raka's Instagram artwork), pack photos of Mozzarella, Pizza, Cheddar, Paneer, Halloumi, Feta, Nyeri Blue and Gouda (Facebook and Instagram), the grazing table, fair and founder photos, Kalpa's welcome reel (Facebook, April 2017), the name story "RA for Rajesh, KA for Kalpa", "Kenya's finest cheese made in the highlands of Nyeri", "#NoOneDoesItLikeRaka", "Don't say cheese, say Raka", started in 2001, purely vegetarian, halloumi set with rennet with no acid, cream cheese in Original, Garlic and Black Pepper, the range list, Kalpa's Grazing Atelier and its occasions, the Peponi customer review, Raka Milk Processors Ltd at Rware on the Nyeri–Nanyuki road (Google Maps), P.O. Box 1182-10100 Nyeri, raka@raka-ke.com, 0722 375 630 (Google Maps and Kalpa's grazing post), 061 203 2025 (the old website), the ugali fritters, palak paneer, paneer makhani and watermelon feta recipes as ideas from Raka's old blog, and "we don't pack in 500 g" (Raka's 2017 press release).

**Written for the mockup, to confirm:**
- That 0722 375 630 takes WhatsApp (it is used for the chat hand-off and the order).
- Pack sizes and the "2.5 kg block" trade size. No prices are shown; prices are confirmed on WhatsApp.
- Delivery terms: chilled delivery around Nyeri and Nanyuki, courier in a cool box elsewhere, collection from the factory shop, no Sunday delivery.
- Opening hours (Google shows "closes 5 pm"; Saturday half day and Sunday closed are assumptions).
- Board names and guest counts for the Grazing Atelier.
- All recipe methods and tips, card copy such as "Made in Nyeri this morning", and the "Carrefour app" stockist line.
- Facebook lists +254 722 519 463 and the old site lists 0733 519 463 for counterfeit reports; neither is used.

**Worth telling the client:** rakacheese.com, the address on their Facebook and Instagram, no longer shows Raka. It now serves an unrelated Chinese download page, and the Linktree is full of unrelated affiliate links. A new site would fix both.

## Run locally

```bash
python tools/serve.py 8793 .     # or: python -m http.server 8793
# open http://127.0.0.1:8793/
```

Review tooling sits in `tools/` (image and video pipelines, screenshots, the order-flow test) and is kept out of the repository with raw sources (`source-assets/`).

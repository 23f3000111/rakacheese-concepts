/* Content shared by both concepts: company, socials, the range, recipes, boards.
   Facts from Raka's own pages are marked in README.md; the rest is written for the mockup. */
(function () {
  var RK = window.RK = window.RK || {};

  RK.company = {
    name: 'Raka Cheese',
    legal: 'Raka Milk Processors Ltd',
    tagline: 'Finest Kenyan Cheese',
    since: 2001,
    phone: '+254 722 375 630',
    phoneHref: 'tel:+254722375630',
    wa: '254722375630',
    landline: '061 203 2025',
    landlineHref: 'tel:+254612032025',
    email: 'raka@raka-ke.com',
    emailHref: 'mailto:raka@raka-ke.com',
    street: 'Rware, Nyeri–Nanyuki Road',
    city: 'Nyeri, Kenya',
    pobox: 'P.O. Box 1182-10100, Nyeri',
    plus: 'HWPW+W3 Nyeri',
    coords: '0°24′46″S · 36°56′43″E',
    // minutes from midnight, Sunday = 0
    week: [null, [480, 1020], [480, 1020], [480, 1020], [480, 1020], [480, 1020], [480, 780]],
    hours: [['Monday to Friday', '8am to 5pm'], ['Saturday', '8am to 1pm'], ['Sunday', 'Closed']],
    directions: 'https://www.google.com/maps/dir/?api=1&destination=-0.412713%2C36.945219',
    maps: 'https://www.google.com/maps/place/Raka+Milk+Processors+Ltd/@-0.412713,36.945219,17z',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.79!2d36.945219!3d-0.412713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18285db9de592ba5%3A0xad0904c5120ead34!2sRaka%20Milk%20Processors%20Ltd!5e0!3m2!1sen!2ske!4v1793005391041!5m2!1sen!2ske'
  };

  RK.socials = [
    { id: 'instagram', name: 'Instagram', handle: '@rakacheese', label: 'Raka Cheese on Instagram', href: 'https://www.instagram.com/rakacheese/', count: '1.6K followers' },
    { id: 'facebook', name: 'Facebook', handle: 'Raka Cheese', label: 'Raka Cheese on Facebook', href: 'https://www.facebook.com/RakaCheese/', count: '18K followers' },
    { id: 'whatsapp', name: 'WhatsApp', handle: '0722 375 630', label: 'Chat with Raka Cheese on WhatsApp', href: 'https://wa.me/254722375630', count: 'Replies in the day' }
  ];

  /* How cheese gets used: the five moods */
  RK.moods = [
    { id: 'melt', name: 'Melt', icon: 'flame', line: 'Golden, bubbling and stretchy.', desc: 'Mozzarella, pizza cheese and cheddar turn gold in the oven and pull into long strings on pizza, toasties and bakes.', img: 'food/melt-pizza-lift-w.webp' },
    { id: 'grill', name: 'Grill', icon: 'flame', line: 'Straight onto the coals.', desc: 'Halloumi and paneer keep their shape on a hot grill or pan: crisp and charred outside, soft and squeaky inside.', img: 'food/halloumi-grill-w.webp' },
    { id: 'crumble', name: 'Crumble', icon: 'crumble', line: 'Salty little clouds.', desc: 'Feta and Nyeri Blue crumble over salads, avocado, watermelon and steaks for a salty, creamy hit.', img: 'food/watermelon-feta-w.webp' },
    { id: 'spread', name: 'Spread', icon: 'knife', line: 'Smooth from the tub.', desc: 'Cream cheese in original, garlic and black pepper: on toast and crackers, in dips, or baked into cheesecake.', img: 'food/cheesecake-w.webp' },
    { id: 'share', name: 'Share', icon: 'board', line: 'A board in the middle.', desc: 'Gouda, brie, cheddar and Nyeri Blue on one board, with fruit, crackers and honey. Everyone reaches in.', img: 'food/board-coral-w.webp' }
  ];

  /* The range. Pack sizes are written for the mockup (see README). g = grams per pack. */
  RK.products = [
    {
      id: 'mozzarella', name: 'Mozzarella', short: 'Mozzarella', color: '#6B3FA0', tint: '#EFE6FA', moods: ['melt'], kind: 'Stretch and melt',
      tagline: 'The stretchy one', label: 'Purple label',
      desc: 'Mild, milky and made to stretch. Raka Mozzarella melts into long golden strings on pizza, lasagne and toasties, and browns beautifully under the grill.',
      uses: ['Pizza', 'Lasagne', 'Toasties', 'Bakes'],
      packs: [{ id: '250g', label: '250 g', g: 250 }, { id: '1kg', label: '1 kg', g: 1000 }, { id: '2500g', label: '2.5 kg block', g: 2500 }], def: 0,
      img: 'food/melt-pull-dark.webp', wide: 'food/melt-pull-dark-w.webp', pack: 'packs/mozzarella.webp', plate: 'plates/pasta.webp'
    },
    {
      id: 'pizza', name: 'Pizza Cheese', short: 'Pizza', color: '#E2382B', tint: '#FDE7E2', moods: ['melt'], kind: 'Made for the oven',
      tagline: 'Built for pizza night', label: 'Red label',
      desc: 'A melting cheese made for the oven. It bubbles, browns in spots and stretches between slices. Grate it straight onto the sauce, at home or in a pizzeria.',
      uses: ['Pizza', 'Garlic bread', 'Bakes', 'Pasta'],
      packs: [{ id: '250g', label: '250 g', g: 250 }, { id: '1kg', label: '1 kg', g: 1000 }, { id: '2500g', label: '2.5 kg block', g: 2500 }], def: 0,
      img: 'food/melt-pizza-lift.webp', wide: 'food/melt-pizza-lift-w.webp', pack: 'packs/pizza.webp', plate: 'plates/margherita.webp'
    },
    {
      id: 'cheddar', name: 'Cheddar', short: 'Cheddar', color: '#F28A1E', tint: '#FFEEDB', moods: ['melt', 'share'], kind: 'The all-rounder',
      tagline: 'The all-rounder', label: 'Red label',
      desc: 'Firm, tangy and golden. Slice it into sandwiches, grate it over ugali fritters and chips, or melt it into mac and cheese. Also in slices and grated.',
      uses: ['Sandwiches', 'Mac and cheese', 'Burgers', 'Boards'],
      packs: [{ id: '250g', label: '250 g block', g: 250 }, { id: '400g', label: '400 g block', g: 400 }, { id: '1kg', label: '1 kg block', g: 1000 }, { id: 'slices', label: '200 g slices', g: 200 }, { id: 'grated', label: '200 g grated', g: 200 }], def: 1,
      img: 'food/melt-sandwich.webp', wide: 'food/melt-sandwich-w.webp', pack: 'packs/cheddar.webp', plate: 'plates/soup.webp'
    },
    {
      id: 'paneer', name: 'Paneer', short: 'Paneer', color: '#2E9E55', tint: '#E3F5EA', moods: ['grill'], kind: 'The curry favourite',
      tagline: 'The curry favourite', label: 'Green label',
      desc: 'Fresh, firm and mild. Paneer holds its shape in curries, on skewers and in a hot pan, and soaks up every spice you give it.',
      uses: ['Curries', 'Tikka', 'Stir-fries', 'Wraps'],
      packs: [{ id: '250g', label: '250 g', g: 250 }, { id: '1kg', label: '1 kg', g: 1000 }], def: 0,
      img: 'food/paneer-tikka.webp', wide: 'food/paneer-tikka-plate-w.webp', pack: 'packs/paneer.webp', plate: 'plates/makhani.webp'
    },
    {
      id: 'halloumi', name: 'Halloumi', short: 'Halloumi', color: '#C23A55', tint: '#FBE4E9', moods: ['grill'], kind: 'The griller',
      tagline: 'The one for the grill', label: 'Red label',
      desc: 'Salty, squeaky and built for the grill. Raka Halloumi keeps its shape on the coals and in the pan, so it goes golden outside and soft inside. Purely vegetarian.',
      uses: ['Grill', 'Salads', 'Wraps', 'Breakfast'],
      packs: [{ id: '250g', label: '250 g', g: 250 }, { id: '1kg', label: '1 kg', g: 1000 }], def: 0,
      img: 'food/halloumi-grill.webp', wide: 'food/halloumi-grill-w.webp', pack: 'packs/halloumi.webp', plate: 'plates/grilled-halloumi.webp'
    },
    {
      id: 'feta', name: 'Feta', short: 'Feta', color: '#2F9BD6', tint: '#E1F2FB', moods: ['crumble'], kind: 'The crumbler',
      tagline: 'The salty crumbler', label: 'Green label',
      desc: 'Salty, creamy and crumbly. Scatter it over salads, avocado and watermelon, or buy it marinated in oil, herbs and garlic, ready for the table.',
      uses: ['Salads', 'Avocado', 'Pastries', 'Mezze'],
      packs: [{ id: '200g', label: '200 g block', g: 200 }, { id: 'jar', label: '300 g marinated jar', g: 300 }], def: 0,
      img: 'food/watermelon-feta.webp', wide: 'food/watermelon-feta-w.webp', pack: 'packs/feta.webp', plate: 'plates/watermelon-feta.webp'
    },
    {
      id: 'nyeri-blue', name: 'Nyeri Blue', short: 'Nyeri Blue', color: '#2B5BB0', tint: '#E2EAFA', moods: ['crumble', 'share'], kind: 'The bold one',
      tagline: 'Named after home', label: 'Blue label',
      desc: 'Our own blue cheese, named after home. Creamy with blue veins and a bold, tangy bite: crumble it into dips and dressings or serve it on a board with honey.',
      uses: ['Boards', 'Dips', 'Steak sauce', 'Salads'],
      packs: [{ id: '150g', label: '150 g wedge', g: 150 }, { id: '1kg', label: '1 kg', g: 1000 }], def: 0,
      img: 'food/blue-board.webp', wide: 'food/blue-board-w.webp', pack: 'packs/nyeri-blue.webp', plate: 'plates/blue.webp'
    },
    {
      id: 'gouda', name: 'Gouda', short: 'Gouda', color: '#E9A400', tint: '#FFF3CC', moods: ['melt', 'share'], kind: 'The smooth one',
      tagline: 'Mellow and buttery', label: 'Gold label',
      desc: 'Mellow, buttery and easy to love. Slice it for sandwiches and boards, or melt it into sauces and mac and cheese.',
      uses: ['Boards', 'Sandwiches', 'Sauces', 'Mac and cheese'],
      packs: [{ id: '250g', label: '250 g', g: 250 }, { id: '1kg', label: '1 kg', g: 1000 }], def: 0,
      img: 'food/wheels-yellow.webp', wide: 'food/wheels-yellow-w.webp', pack: 'packs/gouda.webp', plate: 'plates/gouda.webp'
    },
    {
      id: 'brie', name: 'Brie', short: 'Brie', color: '#7FA83A', tint: '#EEF5E0', moods: ['share'], kind: 'The soft one',
      tagline: 'Soft and creamy', label: 'On order',
      desc: 'A soft white rind and a creamy middle. Serve it at room temperature on a board, or bake it whole with honey and nuts.',
      uses: ['Boards', 'Baked brie', 'Toasts', 'Salads'],
      packs: [{ id: '150g', label: '150 g round', g: 150 }], def: 0,
      img: 'food/brie-berries.webp', wide: 'food/brie-berries-w.webp', pack: '', plate: 'plates/brie.webp'
    },
    {
      id: 'cream-cheese', name: 'Cream Cheese', short: 'Cream cheese', color: '#E8669A', tint: '#FCE6EF', moods: ['spread'], kind: 'The spreadable one',
      tagline: 'Three flavours', label: 'Original, garlic, black pepper',
      desc: 'Smooth and tangy, in Original, Garlic and Black Pepper. Spread it on toast and crackers, stir it into dips and dressings, or bake it into cheesecake.',
      uses: ['Spreads', 'Dips', 'Cheesecake', 'Dressings'],
      packs: [{ id: 'original', label: '200 g original', g: 200 }, { id: 'garlic', label: '200 g garlic', g: 200 }, { id: 'pepper', label: '200 g black pepper', g: 200 }], def: 0,
      img: 'food/cheesecake.webp', wide: 'food/cheesecake-w.webp', pack: '', plate: 'plates/cheesecake.webp'
    }
  ];
  RK.product = function (id) { return RK.products.find(function (p) { return p.id === id; }); };

  /* Recipes: [productId, packId, how many] in .cheese drive "add the cheese to my list" */
  RK.recipes = [
    {
      id: 'ugali-fritters', name: 'Cheesy ugali fritters', badge: 'Kalpa’s recipe', mins: 30, serves: 4, mood: 'melt',
      img: 'food/cheese-balls.webp', plate: 'plates/fritters.webp', cheese: [['cheddar', '250g', 1]],
      intro: 'Kalpa’s own twist from Raka’s recipe videos: leftover ugali, grated Raka Cheddar and a little chilli, fried until golden.',
      ingredients: ['2 cups cold leftover ugali', '150 g Raka Cheddar, grated', '1 egg', '1 small red onion, finely chopped', '1 green chilli, chopped', 'A handful of dhania, chopped', 'Salt and black pepper', 'Oil for shallow frying'],
      method: ['Mash the cold ugali with the egg until smooth.', 'Fold in the cheddar, onion, chilli and dhania. Season.', 'Roll into walnut-sized balls and flatten them a little.', 'Shallow-fry for 3 minutes a side until deep gold, then drain.', 'Serve hot with kachumbari or chilli sauce.'],
      tip: 'Day-old ugali holds together best, and the cheddar melts into little pockets.'
    },
    {
      id: 'margherita', name: 'Pizza night margherita', badge: 'Family favourite', mins: 25, serves: 2, mood: 'melt',
      img: 'food/melt-pizza-lift.webp', plate: 'plates/margherita.webp', cheese: [['pizza', '250g', 1], ['mozzarella', '250g', 1]],
      intro: 'Thin, blistered and properly stretchy. Raka Pizza Cheese for the melt, a little mozzarella for the pull.',
      ingredients: ['1 pizza base or 250 g dough', '4 tbsp tomato sauce', '150 g Raka Pizza Cheese, grated', '80 g Raka Mozzarella, torn', 'Fresh basil', 'Olive oil and a pinch of salt'],
      method: ['Heat the oven as hot as it goes, with a tray inside.', 'Stretch the dough thin and spread the sauce to the edges.', 'Scatter the pizza cheese, then dot the mozzarella on top.', 'Bake 8 to 10 minutes until bubbling and browned in spots.', 'Finish with basil and olive oil. Lift a slice and watch it stretch.'],
      tip: 'Grate the pizza cheese cold: it scatters evenly and melts without going oily.'
    },
    {
      id: 'chapati-quesadilla', name: 'Chapati quesadilla', badge: 'Kenyan twist', mins: 15, serves: 2, mood: 'melt',
      img: 'food/quesadilla.webp', plate: 'plates/flatbread.webp', cheese: [['mozzarella', '250g', 1], ['cheddar', 'grated', 1]],
      intro: 'Yesterday’s chapati, folded around melting cheese, sukuma and a little pilipili. Crisp outside, molten inside.',
      ingredients: ['2 chapatis', '80 g Raka Mozzarella, grated', '60 g Raka Cheddar, grated', 'A handful of sukuma wiki, finely shredded', '1 tomato, diced', 'A pinch of chilli flakes', 'Butter for the pan'],
      method: ['Mix both cheeses with the sukuma, tomato and chilli.', 'Spread the mix over half of each chapati and fold it over.', 'Cook in a buttered pan over medium heat, 3 minutes a side.', 'Press down gently so the cheese reaches the edges.', 'Cut into wedges and serve with guacamole or kachumbari.'],
      tip: 'Keep the heat medium: the cheese needs time to melt before the chapati browns.'
    },
    {
      id: 'grilled-cheese', name: 'Grilled cheese and tomato soup', badge: 'Rainy-day classic', mins: 20, serves: 2, mood: 'melt',
      img: 'food/melt-sandwich.webp', plate: 'plates/soup.webp', cheese: [['cheddar', 'slices', 1], ['mozzarella', '250g', 1]],
      intro: 'Cheddar for flavour, mozzarella for the pull, buttered bread for the crunch. Dunk it in a bowl of hot tomato soup.',
      ingredients: ['4 slices of bread', '4 slices Raka Cheddar', '60 g Raka Mozzarella, grated', 'Butter, soft', '400 g tinned tomatoes', '1 onion, 1 clove garlic', '1 cup stock and a splash of cream'],
      method: ['Soften the onion and garlic, add tomatoes and stock, simmer 10 minutes and blend.', 'Butter the bread on the outside.', 'Fill with cheddar and mozzarella and close the sandwiches.', 'Cook in a pan over medium heat until golden and melting, 3 minutes a side.', 'Cut in half and serve with the soup.'],
      tip: 'A lid on the pan for the first minute helps the middle melt before the bread browns.'
    },
    {
      id: 'mac-cheese', name: 'Baked mac and cheese', badge: 'Crowd pleaser', mins: 40, serves: 4, mood: 'melt',
      img: 'food/mac-bowl.webp', plate: 'plates/mac.webp', cheese: [['cheddar', '400g', 1], ['gouda', '250g', 1]],
      intro: 'A proper cheese sauce made with Raka Cheddar and Gouda, baked until the top crackles.',
      ingredients: ['300 g macaroni', '40 g butter and 40 g flour', '600 ml milk', '250 g Raka Cheddar, grated', '150 g Raka Gouda, grated', '1 tsp mustard, salt and pepper', 'Breadcrumbs for the top'],
      method: ['Boil the macaroni 2 minutes short of the packet time and drain.', 'Melt the butter, stir in the flour, then whisk in the milk until thick.', 'Off the heat, stir in most of the cheese and the mustard. Season.', 'Fold in the pasta, tip into a dish and top with the rest of the cheese and crumbs.', 'Bake at 200°C for 20 minutes until bubbling and golden.'],
      tip: 'Take the sauce off the heat before adding the cheese so it stays silky.'
    },
    {
      id: 'palak-paneer', name: 'Palak paneer', badge: 'From Raka’s kitchen', mins: 35, serves: 4, mood: 'grill',
      img: 'life/palak.webp', plate: 'plates/palak.webp', cheese: [['paneer', '250g', 2]],
      intro: 'Silky spinach, warm spices and golden cubes of Raka Paneer. A favourite from Raka’s own recipe blog.',
      ingredients: ['400 g Raka Paneer, cubed', '500 g spinach', '1 onion, 2 tomatoes', '3 cloves garlic, thumb of ginger', '1 green chilli', '1 tsp each cumin, coriander, garam masala', '2 tbsp cream, ghee or oil'],
      method: ['Blanch the spinach for 2 minutes, cool and blend smooth.', 'Fry the paneer in a little ghee until golden, then set aside.', 'Fry onion, garlic, ginger and chilli, add the spices and tomatoes and cook down.', 'Stir in the spinach and simmer 5 minutes. Season.', 'Add the paneer and cream, warm through and serve with chapati or rice.'],
      tip: 'Soak fried paneer in warm water for 5 minutes and it stays extra soft in the sauce.'
    },
    {
      id: 'paneer-tikka', name: 'Paneer tikka skewers', badge: 'Braai ready', mins: 30, serves: 4, mood: 'grill',
      img: 'food/paneer-tikka.webp', plate: 'plates/tikka.webp', cheese: [['paneer', '250g', 2]],
      intro: 'Yoghurt-marinated paneer, peppers and onion, charred over the coals or under a hot grill.',
      ingredients: ['400 g Raka Paneer, in large cubes', '1 cup thick yoghurt', '1 tbsp ginger-garlic paste', '1 tsp each chilli powder, cumin, garam masala', 'Juice of 1 lemon', '1 green pepper, 1 red onion, in chunks', 'Skewers and a little oil'],
      method: ['Mix the yoghurt, ginger-garlic, spices and lemon with a pinch of salt.', 'Coat the paneer and vegetables and leave for at least 1 hour.', 'Thread onto skewers, alternating paneer and vegetables.', 'Grill over high heat, turning, for 8 to 10 minutes until charred at the edges.', 'Serve with mint chutney and a squeeze of lemon.'],
      tip: 'Large cubes stay juicy; small ones dry out on the coals.'
    },
    {
      id: 'paneer-makhani', name: 'Paneer makhani', badge: 'From Raka’s kitchen', mins: 40, serves: 4, mood: 'grill',
      img: 'food/paneer-makhani.webp', plate: 'plates/makhani.webp', cheese: [['paneer', '250g', 2]],
      intro: 'A rich, buttery tomato gravy with soft paneer. Raka’s blog shared a version by Parita Shah; this is ours for the mockup.',
      ingredients: ['400 g Raka Paneer, cubed', '2 tbsp butter', '1 onion, 3 tomatoes', '10 cashews', '1 tbsp ginger-garlic paste', '1 tsp each chilli, garam masala, dried fenugreek', '3 tbsp cream'],
      method: ['Cook the onion, tomatoes and cashews until soft, then blend smooth.', 'Melt the butter, fry the ginger-garlic and spices for a minute.', 'Add the blended sauce and simmer 10 minutes.', 'Stir in the cream and fenugreek, then the paneer.', 'Simmer 3 minutes and serve with naan, chapati or rice.'],
      tip: 'Rub the dried fenugreek between your palms before adding: that is the restaurant flavour.'
    },
    {
      id: 'grilled-halloumi', name: 'Grilled halloumi, lemon and chilli', badge: '10 minutes', mins: 10, serves: 2, mood: 'grill',
      img: 'food/halloumi-grill.webp', plate: 'plates/grilled-halloumi.webp', cheese: [['halloumi', '250g', 1]],
      intro: 'Thick slices of Raka Halloumi, charred in a hot pan and finished with lemon, honey and chilli.',
      ingredients: ['250 g Raka Halloumi, in 1 cm slices', '1 lemon', '1 tsp honey', 'A pinch of chilli flakes', 'Fresh mint', 'A little olive oil'],
      method: ['Pat the halloumi dry.', 'Heat a griddle or heavy pan until very hot, with a few drops of oil.', 'Cook the slices 2 minutes a side, until deep grill marks appear.', 'Squeeze over lemon, drizzle honey and scatter chilli and mint.', 'Eat straight away, while it squeaks.'],
      tip: 'Don’t move the slices until they release easily: that is when the crust has formed.'
    },
    {
      id: 'watermelon-feta', name: 'Watermelon and feta salad', badge: 'From Raka’s kitchen', mins: 10, serves: 4, mood: 'crumble',
      img: 'food/watermelon-feta.webp', plate: 'plates/watermelon-feta.webp', cheese: [['feta', '200g', 1]],
      intro: 'Cold watermelon, salty Raka Feta, mint and a squeeze of lime. Raka’s blog had it first.',
      ingredients: ['Half a small watermelon, in chunks', '200 g Raka Feta, crumbled', '1 small red onion, thinly sliced', 'A handful of mint', '1 lime', 'Olive oil and black pepper', 'A few toasted nuts, optional'],
      method: ['Chill the watermelon well.', 'Soak the sliced onion in cold water for 5 minutes, then drain.', 'Pile the watermelon on a platter and crumble the feta over.', 'Add the onion, mint and nuts.', 'Dress with lime, olive oil and black pepper just before serving.'],
      tip: 'Crumble the feta by hand into big pieces: they look better and stay creamy.'
    },
    {
      id: 'nyeri-blue-dip', name: 'Nyeri Blue dip', badge: 'Raka favourite', mins: 10, serves: 6, mood: 'crumble',
      img: 'life/blue-dip.webp', plate: 'plates/blue.webp', cheese: [['nyeri-blue', '150g', 1], ['cream-cheese', 'original', 1]],
      intro: 'Raka’s blue cheese dip: Nyeri Blue whipped with cream cheese and yoghurt, served with crunchy vegetables.',
      ingredients: ['100 g Raka Nyeri Blue', '100 g Raka Cream Cheese, original', '3 tbsp thick yoghurt', '1 tsp lemon juice', 'Black pepper and chives', 'Celery, carrots, cucumber and crackers to dip'],
      method: ['Mash the Nyeri Blue with a fork.', 'Beat in the cream cheese, yoghurt and lemon until smooth but still a little chunky.', 'Season with black pepper and fold in the chives.', 'Chill for 30 minutes.', 'Serve with crunchy vegetables and crackers.'],
      tip: 'Also brilliant spooned over a hot steak or nyama choma.'
    },
    {
      id: 'cheesecake', name: 'Strawberry cheesecake', badge: 'Sunday treat', mins: 30, serves: 8, mood: 'spread',
      img: 'food/cheesecake.webp', plate: 'plates/cheesecake.webp', cheese: [['cream-cheese', 'original', 3]],
      intro: '“Enjoy life, eat cheesecake!” A no-fuss baked cheesecake made with Raka Cream Cheese.',
      ingredients: ['200 g digestive biscuits, crushed', '80 g butter, melted', '600 g Raka Cream Cheese, original', '150 g sugar', '3 eggs', '1 tsp vanilla, zest of 1 lemon', 'Strawberries to finish'],
      method: ['Mix biscuits and butter and press into a lined tin. Chill.', 'Beat the cream cheese and sugar until smooth.', 'Beat in the eggs one at a time, then the vanilla and zest.', 'Pour over the base and bake at 160°C for 40 minutes, until just set.', 'Cool in the oven with the door open, chill for 4 hours and top with strawberries.'],
      tip: 'A slight wobble in the middle when it comes out means a creamy cheesecake.'
    }
  ];
  RK.recipe = function (id) { return RK.recipes.find(function (r) { return r.id === id; }); };

  /* Grazing boards by Kalpa's Grazing Atelier */
  RK.boards = [
    { id: 'date', name: 'The date night board', guests: '2 to 4', size: 'Small', desc: 'Three Raka cheeses, crackers, fresh fruit, nuts and something sweet.', img: 'life/board-3.webp' },
    { id: 'family', name: 'The family board', guests: '6 to 8', size: 'Medium', desc: 'Five cheeses, cured meats or veggie bites, dips, bread and seasonal fruit.', img: 'life/board-1.webp' },
    { id: 'party', name: 'The party board', guests: '12 to 15', size: 'Large', desc: 'A big board for birthdays and wine evenings, styled to be the centre of the table.', img: 'life/board-2.webp' },
    { id: 'table', name: 'The grazing table', guests: '30 and more', size: 'Event', desc: 'A whole table, styled on site, for weddings, showers and corporate events.', img: 'life/grazing-1.webp' }
  ];
  RK.occasions = ['Birthdays', 'Corporate events', 'Bridal and baby showers', 'Wine and cheese evenings', 'Family gatherings', 'House parties', 'Weddings'];

  RK.areas = ['Nyeri', 'Nanyuki', 'Karatina', 'Othaya', 'Nairobi', 'Thika', 'Murang’a', 'Meru', 'Embu', 'Nakuru', 'Naivasha', 'Mombasa', 'Kisumu', 'Eldoret', 'Another town (courier)'];
  RK.businessTypes = ['Restaurant or café', 'Pizzeria', 'Hotel or lodge', 'Caterer', 'Supermarket or shop', 'School or institution', 'Bakery', 'Other'];

  RK.review = {
    quote: 'Tasted some of your delicious cheese during the art fair in Peponi and I did not have any reaction despite having secondary lactose intolerance!',
    who: 'A customer at the Peponi art fair', where: 'Shared by Raka on Instagram'
  };
})();

// Size helpers keep the list short
const apparel = (s, m, l, xl) => [
  { size: 'S', stock: s }, { size: 'M', stock: m },
  { size: 'L', stock: l }, { size: 'XL', stock: xl },
];
const womens = (xs, s, m, l) => [
  { size: 'XS', stock: xs }, { size: 'S', stock: s },
  { size: 'M', stock: m }, { size: 'L', stock: l },
];
const oneSize = (stock) => [{ size: 'One size', stock }];

const black = { name: 'Black', hex: '#1a1c20' };
const bone = { name: 'Bone', hex: '#e7e2d6' };
const cobalt = { name: 'Cobalt', hex: '#2445c9' };
const olive = { name: 'Olive', hex: '#5d6146' };
const slate = { name: 'Slate', hex: '#4f5a68' };
const rose = { name: 'Rose', hex: '#d9a3a0' };
const sand = { name: 'Sand', hex: '#d8c4a2' };
const clay = { name: 'Clay', hex: '#b8664a' };
const charcoal = { name: 'Charcoal', hex: '#3a3d42' };
const white = { name: 'White', hex: '#f5f5f2' };
const navy = { name: 'Navy', hex: '#1f2a44' };
const sage = { name: 'Sage', hex: '#9caf94' };
const mocha = { name: 'Mocha', hex: '#7a5c4a' };

const products = [
  // Men
  {
    name: 'Stride Mesh Jersey', slug: 'stride-mesh-jersey',
    description: 'Breathable mesh training jersey with dropped shoulders and a split hem.',
    gender: 'men', category: 'tees', activities: ['running', 'lifting'],
    price: 5650, images: ['/images/products/stride-mesh-jersey.jpg'],
    colours: [cobalt, black, bone], sizes: apparel(12, 20, 18, 8),
    badge: 'New', isFeatured: true,
  },
  {
    name: 'Heavyweight Oversize Tee', slug: 'heavyweight-oversize-tee',
    description: '240 GSM cotton tee with a boxy, dropped-shoulder fit.',
    gender: 'men', category: 'tees', activities: ['casual', 'rest-day'],
    price: 4950, images: ['/images/products/heavyweight-oversize-tee.jpg'],
    colours: [bone, black, olive, clay], sizes: apparel(15, 25, 22, 10),
    isFeatured: true,
  },
  {
    name: 'Apex Wide Track Jogger', slug: 'apex-wide-track-jogger',
    description: 'Relaxed wide-leg track pant with side panels and a drawcord waist.',
    gender: 'men', category: 'joggers', activities: ['rest-day', 'casual'],
    price: 6800, images: ['/images/products/apex-wide-track-jogger.jpg'],
    colours: [black, slate], sizes: apparel(8, 14, 14, 6),
    badge: 'New', isFeatured: true,
  },
  {
    name: 'Ridge Training Short 7"', slug: 'ridge-training-short',
    description: 'Lightweight 7-inch short with a liner and zip phone pocket.',
    gender: 'men', category: 'shorts', activities: ['running', 'lifting'],
    price: 4450, images: ['/images/products/ridge-training-short.jpg'],
    colours: [black, cobalt, sand], sizes: apparel(10, 18, 16, 6),
  },
  {
    name: 'Core Lifting Tank', slug: 'core-lifting-tank',
    description: 'Deep-cut cotton tank for heavy days under the bar.',
    gender: 'men', category: 'tanks', activities: ['lifting'],
    price: 3650, images: ['/images/products/core-lifting-tank.jpg'],
    colours: [black, olive], sizes: apparel(6, 12, 12, 4),
  },
  {
    name: 'Coastline Zip Jacket', slug: 'coastline-zip-jacket',
    description: 'Light shell jacket with a packable hood, for early-morning runs.',
    gender: 'men', category: 'jackets', activities: ['running', 'casual'],
    price: 8900, compareAtPrice: 10500,
    images: ['/images/products/coastline-zip-jacket.jpg'],
    colours: [slate, black], sizes: apparel(4, 8, 8, 3),
  },
  {
    name: 'Tempo Seamless Tee', slug: 'tempo-seamless-tee',
    description: 'Knitted seamless tee with a muscle fit and a vented back panel.',
    gender: 'men', category: 'tees', activities: ['lifting', 'running'],
    price: 5450, images: ['/images/products/tempo-seamless-tee.jpg'],
    colours: [charcoal, black, navy], sizes: apparel(10, 18, 16, 7),
    badge: 'New',
  },
  {
    name: 'Essential Pique Polo', slug: 'essential-pique-polo',
    description: 'Cotton-blend pique polo with a two-button placket, smart enough for after the gym.',
    gender: 'men', category: 'polos', activities: ['casual'],
    price: 5250, images: ['/images/products/essential-pique-polo.jpg'],
    colours: [white, navy, black], sizes: apparel(8, 16, 16, 8),
  },
  {
    name: 'Ironclad Compression Top', slug: 'ironclad-compression-top',
    description: 'Long-sleeve compression base layer that wicks sweat and holds its shape.',
    gender: 'men', category: 'compression', activities: ['lifting', 'running'],
    price: 4850, images: ['/images/products/ironclad-compression-top.jpg'],
    colours: [black, white], sizes: apparel(8, 14, 14, 6),
  },
  {
    name: 'Ironclad Compression Short', slug: 'ironclad-compression-short',
    description: 'Mid-thigh compression short with flatlock seams, worn alone or under a training short.',
    gender: 'men', category: 'compression', activities: ['lifting', 'running'],
    price: 3950, images: ['/images/products/ironclad-compression-short.jpg'],
    colours: [black, charcoal], sizes: apparel(6, 12, 12, 5),
  },
  {
    name: 'Rest Day Fleece Hoodie', slug: 'rest-day-fleece-hoodie',
    description: 'Brushed-back fleece hoodie with a boxy fit and a double-layer hood.',
    gender: 'men', category: 'hoodies', activities: ['rest-day', 'casual'],
    price: 7950, images: ['/images/products/rest-day-fleece-hoodie.jpg'],
    colours: [charcoal, bone, olive], sizes: apparel(6, 12, 12, 6),
    badge: 'Best seller', isFeatured: true,
  },
  {
    name: 'Tapered Cargo Jogger', slug: 'tapered-cargo-jogger',
    description: 'Stretch-woven jogger with zip cargo pockets and ribbed cuffs.',
    gender: 'men', category: 'joggers', activities: ['casual', 'rest-day'],
    price: 6500, images: ['/images/products/tapered-cargo-jogger.jpg'],
    colours: [olive, black, sand], sizes: apparel(7, 14, 13, 6),
  },
  {
    name: 'Ridge Stringer Vest', slug: 'ridge-stringer-vest',
    description: 'Racerback stringer with deep armholes for a full range of motion.',
    gender: 'men', category: 'tanks', activities: ['lifting'],
    price: 3450, compareAtPrice: 4250,
    images: ['/images/products/ridge-stringer-vest.jpg'],
    colours: [black, white, cobalt], sizes: apparel(5, 10, 10, 4),
  },
  {
    name: 'Harbour Run Short 5"', slug: 'harbour-run-short',
    description: 'Quick-dry 5-inch run short with reflective trims and a key pocket.',
    gender: 'men', category: 'shorts', activities: ['running'],
    price: 4250, images: ['/images/products/harbour-run-short.jpg'],
    colours: [navy, black], sizes: apparel(8, 14, 14, 6),
  },
  // Women
  {
    name: 'Flowline Flare Legging', slug: 'flowline-flare-legging',
    description: 'High-rise, squat-proof flare legging in four-way stretch fabric.',
    gender: 'women', category: 'leggings', activities: ['pilates-yoga', 'rest-day'],
    price: 7250, images: ['/images/products/flowline-flare-legging.jpg'],
    colours: [black, rose], sizes: womens(6, 14, 14, 5),
    badge: 'Best seller', isFeatured: true,
  },
  {
    name: 'Flowline Halter Bra', slug: 'flowline-halter-bra',
    description: 'Medium-support halter sports bra with removable pads.',
    gender: 'women', category: 'sports-bras', activities: ['pilates-yoga', 'lifting'],
    price: 5250, images: ['/images/products/flowline-halter-bra.jpg'],
    colours: [rose, black, olive], sizes: womens(8, 16, 14, 6),
    isFeatured: true,
  },
  {
    name: 'Studio Ribbed Crop', slug: 'studio-ribbed-crop',
    description: 'Soft ribbed crop top with a fitted body and short sleeves.',
    gender: 'women', category: 'crop-tops', activities: ['pilates-yoga', 'casual'],
    price: 4650, images: ['/images/products/studio-ribbed-crop.jpg'],
    colours: [sand, black], sizes: womens(10, 15, 12, 5),
    badge: 'New', isFeatured: true,
  },
  {
    name: 'Pace Running Short', slug: 'pace-running-short',
    description: 'Feather-light 3-inch running short with a built-in brief.',
    gender: 'women', category: 'shorts', activities: ['running'],
    price: 4250, images: ['/images/products/pace-running-short.jpg'],
    colours: [black, cobalt], sizes: womens(6, 12, 12, 4),
  },
  {
    name: 'Contour Seamless Legging', slug: 'contour-seamless-legging',
    description: 'Seamless high-waist legging with ribbed contour panels and no front seam.',
    gender: 'women', category: 'leggings', activities: ['lifting', 'pilates-yoga'],
    price: 6950, images: ['/images/products/contour-seamless-legging.jpg'],
    colours: [mocha, black, sage], sizes: womens(6, 12, 12, 5),
    badge: 'New', isFeatured: true,
  },
  {
    name: 'Contour Seamless Bra', slug: 'contour-seamless-bra',
    description: 'Light-support seamless bra that pairs with the Contour legging.',
    gender: 'women', category: 'sports-bras', activities: ['pilates-yoga', 'lifting'],
    price: 4850, images: ['/images/products/contour-seamless-bra.jpg'],
    colours: [mocha, black, sage], sizes: womens(6, 12, 12, 5),
  },
  {
    name: 'Airlight Racer Tank', slug: 'airlight-racer-tank',
    description: 'Featherweight racerback tank with a relaxed drape and a curved hem.',
    gender: 'women', category: 'tanks', activities: ['running', 'lifting'],
    price: 3950, images: ['/images/products/airlight-racer-tank.jpg'],
    colours: [white, black, rose], sizes: womens(8, 14, 12, 5),
  },
  {
    name: 'Sculpt Biker Short', slug: 'sculpt-biker-short',
    description: '6-inch high-rise biker short with a hidden waistband pocket.',
    gender: 'women', category: 'shorts', activities: ['lifting', 'pilates-yoga'],
    price: 4450, images: ['/images/products/sculpt-biker-short.jpg'],
    colours: [black, navy, sage], sizes: womens(8, 14, 14, 6),
    badge: 'Best seller',
  },
  {
    name: 'Weekend Relaxed Jogger', slug: 'weekend-relaxed-jogger',
    description: 'Soft French-terry jogger with a relaxed leg and elastic cuffs.',
    gender: 'women', category: 'joggers', activities: ['rest-day', 'casual'],
    price: 5950, images: ['/images/products/weekend-relaxed-jogger.jpg'],
    colours: [sand, charcoal], sizes: womens(6, 12, 12, 5),
  },
  {
    name: 'Cropped Zip Hoodie', slug: 'cropped-zip-hoodie',
    description: 'Cropped full-zip hoodie in brushed fleece, made for layering over a bra.',
    gender: 'women', category: 'hoodies', activities: ['rest-day', 'casual'],
    price: 7450, images: ['/images/products/cropped-zip-hoodie.jpg'],
    colours: [bone, black, rose], sizes: womens(5, 10, 10, 4),
    isFeatured: true,
  },
  {
    name: 'Court Pleated Skort', slug: 'court-pleated-skort',
    description: 'Pleated tennis skort with built-in shorts and a ball pocket.',
    gender: 'women', category: 'skirts', activities: ['running', 'casual'],
    price: 4950, compareAtPrice: 5850,
    images: ['/images/products/court-pleated-skort.jpg'],
    colours: [white, black], sizes: womens(4, 8, 8, 3),
  },
  {
    name: 'Studio Long-sleeve Crop', slug: 'studio-long-sleeve-crop',
    description: 'Ribbed long-sleeve crop with thumbholes for cooler studio mornings.',
    gender: 'women', category: 'crop-tops', activities: ['pilates-yoga', 'casual'],
    price: 4950, images: ['/images/products/studio-long-sleeve-crop.jpg'],
    colours: [sage, black, bone], sizes: womens(6, 12, 10, 4),
  },
  // Accessories
  {
    name: 'Basecamp Duffel 40L', slug: 'basecamp-duffel-40l',
    description: 'Water-resistant gym duffel with a separate shoe compartment.',
    gender: 'unisex', category: 'bags', activities: ['lifting'],
    price: 14250, images: ['/images/products/basecamp-duffel-40l.jpg'],
    colours: [black, olive], sizes: oneSize(25),
  },
  {
    name: 'Insulated Bottle 1L', slug: 'insulated-bottle-1l',
    description: 'Double-wall steel bottle that keeps water cold for 24 hours.',
    gender: 'unisex', category: 'bottles', activities: ['lifting', 'running'],
    price: 6250, images: ['/images/products/insulated-bottle-1l.jpg'],
    colours: [slate, bone, cobalt], sizes: oneSize(40),
  },
  {
    name: 'Six-panel Training Cap', slug: 'six-panel-training-cap',
    description: 'Lightweight cap with a curved brim and adjustable strap.',
    gender: 'unisex', category: 'caps', activities: ['running', 'casual'],
    price: 3450, images: ['/images/products/six-panel-training-cap.jpg'],
    colours: [black, sand], sizes: oneSize(30),
  },
];

export default products;
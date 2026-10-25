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
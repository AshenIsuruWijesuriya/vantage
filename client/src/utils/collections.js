// What each collection shows. Accessories are stored with gender "unisex".
export const COLLECTIONS = {
  women: {
    title: "Women's",
    intro: 'Squat-proof leggings, supportive bras and easy layers for training and rest days.',
    apiGender: 'women',
    categories: ['leggings', 'sports-bras', 'crop-tops', 'tanks', 'shorts', 'skirts', 'joggers', 'hoodies'],
  },
  men: {
    title: "Men's",
    intro: 'Heavyweight tees, track pants and training shorts built for Colombo heat.',
    apiGender: 'men',
    categories: ['tees', 'polos', 'tanks', 'compression', 'shorts', 'joggers', 'hoodies', 'jackets'],
  },
  accessories: {
    title: 'Accessories',
    intro: 'Bags, bottles and caps to finish the kit.',
    apiGender: 'unisex',
    categories: ['bags', 'bottles', 'caps'],
  },
};

// "sports-bras" → "sports bras"
export const categoryLabel = (slug) => slug.replace('-', ' ');

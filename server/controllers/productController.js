import Product from '../models/Product.js';

// Makes search text safe to use inside a regular expression
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/products?gender=women&category=leggings&activity=running&keyword=jogger&sort=price-asc&page=1
export const getProducts = async (req, res) => {
  const { gender, category, activity, keyword, featured, sort } = req.query;
  const filter = {};
  if (gender) filter.gender = { $in: [gender, 'unisex'] };
  if (category) filter.category = category;
  if (activity) filter.activities = activity;
  if (featured === 'true') filter.isFeatured = true;
  // A repeated ?keyword= arrives as an array, so only search plain text
  if (typeof keyword === 'string' && keyword) filter.name = { $regex: escapeRegex(keyword), $options: 'i' };

  const sorts = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
  };
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = 12;

  const [products, count] = await Promise.all([
    Product.find(filter).sort(sorts[sort] || sorts.newest).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ products, page, pages: Math.ceil(count / limit), count });
};

// GET /api/products/:slug
export const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
};

// POST /api/products (admin, connected in Step 6)
export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// PUT /api/products/:id (admin, connected in Step 6)
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
};

// DELETE /api/products/:id (admin, connected in Step 6)
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ message: 'Product deleted' });
};
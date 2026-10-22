import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
    category: { type: String, required: true }, // tees, joggers, leggings, sports-bras, bags...
    activities: [
      { type: String, enum: ['lifting', 'running', 'rest-day', 'casual', 'pilates-yoga'] },
    ],
    price: { type: Number, required: true, min: 0 }, // LKR
    compareAtPrice: { type: Number, default: 0 },    // old price, for sale items
    images: [String],
    colours: [{ name: String, hex: String }],
    sizes: [{ size: String, stock: { type: Number, default: 0, min: 0 } }],
    badge: { type: String, default: '' },             // 'New', 'Best seller'
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
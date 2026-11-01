import mongoose from 'mongoose';

// One slide in the home page slideshow
const heroSlideSchema = new mongoose.Schema(
  {
    image: { type: String, required: [true, 'Upload a photo for the slide'] },
    eyebrow: { type: String, default: '', trim: true },   // small label, e.g. "FW26 · Drop 02"
    headline: { type: String, required: [true, 'Add a headline'], trim: true },
    text: { type: String, default: '', trim: true },
    buttonText: { type: String, default: 'Shop now', trim: true },
    buttonLink: {
      type: String,
      default: '/collections/women',
      trim: true,
      match: [/^(\/|https?:\/\/)/, 'Button link must start with / (a page on this site) or http'],
    },
    position: { type: Number, default: 0 }, // display order: 0 first
    isActive: { type: Boolean, default: true }, // hidden slides stay saved but aren't shown
  },
  { timestamps: true }
);

export default mongoose.model('HeroSlide', heroSlideSchema);
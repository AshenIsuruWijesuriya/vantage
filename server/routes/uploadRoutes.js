import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const MAX_FILES = 6;

// Product photos are shrunk to 1600px wide; full-width hero banners to 2400px
const UPLOAD_TYPES = {
  product: { folder: 'vantage/products', width: 1600 },
  hero: { folder: 'vantage/hero', width: 2400 },
};

// Keep files in memory just long enough to pass them to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: MAX_FILES }, // 5 MB each
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|avif)$/.test(file.mimetype)) return cb(null, true);
    const error = new Error('Only JPG, PNG, WebP or AVIF images are allowed');
    error.code = 'INVALID_FILE_TYPE';
    cb(error);
  },
});

// Send one file to Cloudinary
const sendToCloudinary = (buffer, { folder, width }) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width, crop: 'limit', quality: 'auto:good' }],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

const router = express.Router();

// POST /api/upload            → product photos
// POST /api/upload?type=hero  → hero banner photos
// (admin only)  form field name: "images"
router.post('/', protect, admin, upload.array('images', MAX_FILES), async (req, res) => {
  if (!req.files?.length) {
    res.status(400);
    throw new Error('Choose at least one image');
  }
  const settings = UPLOAD_TYPES[req.query.type] || UPLOAD_TYPES.product;
  const results = await Promise.all(req.files.map((file) => sendToCloudinary(file.buffer, settings)));
  res.status(201).json({ urls: results.map((r) => r.secure_url) });
});

export default router;
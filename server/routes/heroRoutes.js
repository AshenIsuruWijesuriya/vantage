import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getActiveSlides, getAllSlides, createSlide, updateSlide, deleteSlide, reorderSlides,
} from '../controllers/heroController.js';

const router = express.Router();

router.get('/', getActiveSlides);                         // public
router.get('/all', protect, admin, getAllSlides);
router.put('/reorder', protect, admin, reorderSlides);    // must be above /:id
router.post('/', protect, admin, createSlide);
router.put('/:id', protect, admin, updateSlide);
router.delete('/:id', protect, admin, deleteSlide);

export default router;
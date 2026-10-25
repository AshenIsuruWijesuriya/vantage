import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createOrder, getMyOrders, getOrders, updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
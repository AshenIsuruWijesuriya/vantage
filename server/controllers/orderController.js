import Order from '../models/Order.js';
import Product from '../models/Product.js';

const FREE_DELIVERY = 15000;
const DELIVERY_FEE = 450;
const ADDRESS_FIELDS = ['fullName', 'phone', 'address', 'city', 'district'];

// Put the stock for these order items back on the shelf
const restock = async (items) => {
  for (const item of items) {
    await Product.updateOne(
      { _id: item.product, 'sizes.size': item.size },
      { $inc: { 'sizes.$.stock': item.qty } }
    );
  }
};

// POST /api/orders
// body: { items: [{ productId, colour, size, qty }], shippingAddress: {...} }
export const createOrder = async (req, res) => {
  const { items, shippingAddress } = req.body || {};

  // 1. Check the request before touching any stock
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Your bag is empty');
  }
  const missing = ADDRESS_FIELDS.filter((f) => {
    const value = shippingAddress?.[f];
    return typeof value !== 'string' || !value.trim();
  });
  if (missing.length) {
    res.status(400);
    throw new Error(`Please fill in: ${missing.join(', ')}`);
  }

  // 2. Look up every product and use the DATABASE price, never the browser's
  const products = await Product.find({ _id: { $in: items.map((i) => i?.productId) } });

  const orderItems = items.map((i) => {
    const product = products.find((p) => p._id.equals(i?.productId));
    const size = product?.sizes.find((s) => s.size === i.size);
    const chosenColour = product?.colours.find((c) => c.name === i.colour);
    const qty = Number(i?.qty);
    // A product with colours must be ordered in one of them
    const colourOk = product && (product.colours.length === 0 || chosenColour);
    if (!product || !size || !colourOk || !Number.isInteger(qty) || qty < 1) {
      res.status(400);
      throw new Error('One of the items in your bag is no longer available');
    }
    if (size.stock < qty) {
      res.status(400);
      throw new Error(`Only ${size.stock} left of ${product.name} in size ${i.size}`);
    }
    return {
      product: product._id,
      name: product.name,
      image: chosenColour?.images?.[0] || product.images[0],
      price: product.price,
      colour: i.colour,
      size: i.size,
      qty,
    };
  });

  // 3. Reduce stock one item at a time, only where enough is left.
  //    If one fails, put back the stock already taken for earlier items.
  const reserved = [];
  for (const item of orderItems) {
    const result = await Product.updateOne(
      { _id: item.product, sizes: { $elemMatch: { size: item.size, stock: { $gte: item.qty } } } },
      { $inc: { 'sizes.$.stock': -item.qty } }
    );
    if (result.modifiedCount === 0) {
      await restock(reserved);
      res.status(400);
      throw new Error(`${item.name} (${item.size}) just sold out`);
    }
    reserved.push(item);
  }

  // 4. Work out totals on the server and save the order
  const itemsPrice = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingPrice = itemsPrice >= FREE_DELIVERY ? 0 : DELIVERY_FEE;

  try {
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice: itemsPrice + shippingPrice,
    });
    res.status(201).json(order);
  } catch (error) {
    // The order wasn't saved, so the stock taken in step 3 goes back
    await restock(reserved);
    throw error;
  }
};

// GET /api/orders/mine
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// GET /api/orders (admin)
export const getOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

// PUT /api/orders/:id/status (admin)  body: { status: 'Shipped' }
export const updateOrderStatus = async (req, res) => {
  const status = req.body?.status;
  if (!STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${STATUSES.join(', ')}`);
  }

  // Change the status in one step, and only if the order isn't already cancelled,
  // so two requests at once can't both cancel it (and restock it twice)
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, status: { $ne: 'Cancelled' } },
    { status },
    { returnDocument: 'before' }
  );
  if (!order) {
    const exists = await Order.exists({ _id: req.params.id });
    res.status(exists ? 400 : 404);
    throw new Error(exists ? 'This order is cancelled and can no longer be changed' : 'Order not found');
  }

  // Cancelling puts the items back in stock
  if (status === 'Cancelled') await restock(order.items);

  order.status = status;
  res.json(order);
};

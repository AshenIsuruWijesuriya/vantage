import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Allows any logged-in user
export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Please log in first');
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch {
    res.status(401);
    throw new Error('Your session has expired. Log in again.');
  }
  if (!req.user) {
    res.status(401);
    throw new Error('Account not found');
  }
  next();
};

// Allows admins only (use after protect)
export const admin = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  res.status(403);
  throw new Error('Admin access only');
};
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const authResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  token: generateToken(user._id),
});

// POST /api/users/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (![name, email, password].every((v) => typeof v === 'string' && v)) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  if (await User.findOne({ email: email.toLowerCase() })) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }
  const user = await User.create({ name, email, password });
  res.status(201).json(authResponse(user));
};

// POST /api/users/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body || {};
  if (![email, password].every((v) => typeof v === 'string' && v)) {
    res.status(400);
    throw new Error('Enter your email and password');
  }
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.json(authResponse(user));
};

// GET /api/users/me
export const getMe = async (req, res) => res.json(req.user);
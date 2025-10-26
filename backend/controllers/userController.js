import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Cart from "../models/Cart.js";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, email, password });

  // Create empty cart for new user
  await Cart.create({ user: user._id, items: [] });

  res.status(201).json({ _id: user.id, name: user.name, email: user.email, token: generateToken(user.id) });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({ _id: user.id, name: user.name, email: user.email, token: generateToken(user.id), isAdmin: user.isAdmin });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 15 } = req.query;

  const skip = (page - 1) * limit;
  const users = await User.find({}).select('-password').skip(skip).limit(Number(limit));
  const total = await User.countDocuments();

  res.json({
    users,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    totalUsers: total
  });
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (user) {
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

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

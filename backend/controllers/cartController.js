import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) return res.json({ items: [] });
  res.json(cart);
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  // Check if product exists and has sufficient stock
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.stock < quantity) return res.status(400).json({ message: "Insufficient stock" });

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

  if (itemIndex > -1) {
    // Check if adding more would exceed stock
    const newQuantity = cart.items[itemIndex].quantity + quantity;
    if (newQuantity > product.stock) {
      return res.status(400).json({ message: "Insufficient stock for requested quantity" });
    }
    cart.items[itemIndex].quantity = newQuantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  // Reduce stock
  product.stock -= quantity;
  await product.save();

  await cart.save();
  res.json(cart);
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  // Find the item to get the quantity before removing
  const itemToRemove = cart.items.find((item) => item.product.toString() === productId);
  if (!itemToRemove) return res.status(404).json({ message: "Item not found in cart" });

  // Restore stock
  const product = await Product.findById(productId);
  if (product) {
    product.stock += itemToRemove.quantity;
    await product.save();
  }

  // Remove item from cart
  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  await cart.save();
  res.json(cart);
};

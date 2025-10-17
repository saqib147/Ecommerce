import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) return res.json({ items: [] });
  res.json(cart);
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

  if (quantity > 0) {
    // Adding quantity
    if (itemIndex > -1) {
      // Check if adding more would exceed stock
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: "Insufficient stock for requested quantity" });
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      if (quantity > product.stock) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
      cart.items.push({ product: productId, quantity });
    }
    // Reduce stock
    product.stock -= quantity;
    await product.save();
  } else if (quantity < 0) {
    // Decreasing quantity
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity; // quantity is negative, so subtracts
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
      // Restore stock
      product.stock -= quantity; // quantity negative, so adds back
      await product.save();
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } else {
    // quantity 0, do nothing
    return res.json(cart);
  }

  await cart.save();
  const populatedCart = await Cart.findById(cart._id).populate("items.product");
  res.json(populatedCart);
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
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
  const populatedCart = await Cart.findById(cart._id).populate("items.product");
  res.json(populatedCart);
};

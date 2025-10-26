import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  // Validate required fields
  if (!shippingAddress || !paymentMethod) {
    return res.status(400).json({ message: "Shipping address and payment method are required" });
  }

  // Validate shipping address structure
  if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
    return res.status(400).json({ message: "Shipping address must include address, city, postalCode, and country" });
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

  // Calculate total using discounted price if available, otherwise regular price
  const total = cart.items.reduce((sum, item) => {
    const price = item.product.discountedPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const order = await Order.create({
    user: req.user._id,
    items: cart.items,
    totalAmount: total,
    shippingAddress,
    paymentMethod,
  });

  // Clear the cart after successful order creation
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("items.product");
  res.json(orders);
};

export const getAllOrders = async (req, res) => {
  const { page = 1, limit = 15 } = req.query;

  const skip = (page - 1) * limit;
  const orders = await Order.find({})
    .populate("items.product")
    .populate("user", "name email")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 }); // Sort by newest first

  const total = await Order.countDocuments();

  res.json({
    orders,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    totalOrders: total
  });
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.product");
  if (!order) return res.status(404).json({ message: "Order not found" });

  const previousStatus = order.status;
  order.status = req.body.status;

  // If order is being cancelled, restore stock
  if (req.body.status === "Cancelled" && previousStatus !== "Cancelled") {
    for (const item of order.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
  }

  await order.save();
  res.json(order);
};

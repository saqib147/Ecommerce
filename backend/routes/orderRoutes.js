import express from "express";
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderStatus } from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route for order tracking
router.route("/:orderId/track").get(getOrderStatus);

// Protected routes
router.route("/").post(protect, createOrder).get(protect, getMyOrders);
router.route("/all").get(protect, admin, getAllOrders);
router.route("/:id/status").put(protect, admin, updateOrderStatus);

export default router;

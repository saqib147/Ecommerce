import express from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory, uploadImages } from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route("/category/:category")
  .get(getProductsByCategory);

// Image upload route
router.post("/upload", protect, admin, uploadImages, (req, res) => {
  try {
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ imageUrls });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
});

export default router;

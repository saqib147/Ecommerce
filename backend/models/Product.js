import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String },
  price: { type: Number, required: true }, // Original price
  discountedPrice: { type: Number }, // Optional discounted price
  images: [{ type: String }], // Array of image URLs
  shortDescription: { type: String, required: true },
  longDescription: { type: String },
  stock: { type: Number, default: 0 }, // Stock quantity
  rating: { type: Number, default: 0, min: 0, max: 5 }, // Average rating
  numReviews: { type: Number, default: 0 }, // Number of reviews
  isFeatured: { type: Boolean, default: false }, // Featured product flag
  tags: [{ type: String }], // Tags for search/filtering
}, { timestamps: true });

export default mongoose.model("Product", productSchema);

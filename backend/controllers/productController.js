import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const { category, brand, minPrice, maxPrice, search, featured, page = 1, limit = 10, sort } = req.query;

  let query = {};

  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (featured === 'true') query.isFeatured = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  let sortOption = {};
  if (sort) {
    sortOption = sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 };
  }

  const skip = (page - 1) * limit;
  const products = await Product.find(query).sort(sortOption).skip(skip).limit(Number(limit));
  const total = await Product.countDocuments(query);

  res.json({
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    totalProducts: total
  });
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  product ? res.json(product) : res.status(404).json({ message: "Product not found" });
};

export const createProduct = async (req, res) => {
  const {
    name,
    category,
    brand,
    price,
    discountedPrice,
    images,
    shortDescription,
    longDescription,
    stock,
    isFeatured,
    tags
  } = req.body;

  const product = await Product.create({
    name,
    category,
    brand,
    price,
    discountedPrice,
    images: images || [],
    shortDescription,
    longDescription,
    stock: stock || 0,
    isFeatured: isFeatured || false,
    tags: tags || []
  });

  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 10, sort } = req.query;

  let query = { category: { $regex: category, $options: 'i' } };

  let sortOption = {};
  if (sort) {
    sortOption = sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 };
  }

  const skip = (page - 1) * limit;
  const products = await Product.find(query).sort(sortOption).skip(skip).limit(Number(limit));
  const total = await Product.countDocuments(query);

  res.json({
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    totalProducts: total
  });
};

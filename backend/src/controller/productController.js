const Product = require("../models/product");
const Fuse = require("fuse.js");

// GET all with filters + fuzzy search + pagination
const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, discount, minViews, q } = req.query;
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    let filter = {};

    if (category) filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (discount) filter.discount = { $gte: Number(discount) };
    if (minViews) filter.views = { $gte: Number(minViews) };

    let allProducts = await Product.find(filter);

    // 🔍 fuzzy search with Fuse.js
    if (q) {
      const fuse = new Fuse(allProducts, {
        keys: ["name", "description"],
        threshold: 0.3, // 0.0 = exact, 1.0 = very fuzzy
      });
      allProducts = fuse.search(q).map((r) => r.item);
    }

    const total = allProducts.length;
    const data = allProducts.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({ offset, limit, total, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

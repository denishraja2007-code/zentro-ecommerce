const Product = require("../models/Product");

// GET /api/products?search=&category=&sort=&page=1&limit=8
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, sort, page, limit } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category && category !== "all") filter.category = category;

    let sortBy = { createdAt: -1 };
    if (sort === "price_asc") sortBy = { price: 1 };
    if (sort === "price_desc") sortBy = { price: -1 };

    // page kudukkala na ellaa products um (Home, Admin ku)
    if (!page) {
      const products = await Product.find(filter).sort(sortBy);
      return res.json(products);
    }

    const pageNum = Math.max(1, Number(page));
    const perPage = Math.max(1, Number(limit) || 8);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortBy)
      .skip((pageNum - 1) * perPage)
      .limit(perPage);

    res.json({ products, total, pages: Math.ceil(total / perPage), page: pageNum });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
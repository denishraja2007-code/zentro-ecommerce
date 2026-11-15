const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res, next) => {
  try {
    if (req.user.role === "admin")
      return res.status(403).json({ message: "Admin cannot place orders" });

    const { items, address, paymentMethod } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });
    if (!address) return res.status(400).json({ message: "Address required" });

    const orderItems = [];
    let totalPrice = 0;

    // Mudhalla ellathaiyum validate pannurom (stock check)
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: "Product not found" });
      if (product.stock < item.qty)
        return res.status(400).json({
          message: `${product.name}: only ${product.stock} left in stock`,
        });

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: item.qty,
      });
      totalPrice += product.price * item.qty;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      address,
      totalPrice,
      paymentMethod: paymentMethod || "COD",
    });

    // Order success aanadhum stock kuraikkurom
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });
    if (order.status !== "Pending")
      return res.status(400).json({ message: "Only pending orders can be cancelled" });

    order.status = "Cancelled";
    await order.save();

    // Stock thirumba serkkurom
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "Cancelled")
      return res.status(400).json({ message: "Cancelled order cannot be changed" });

    order.status = req.body.status;
    if (req.body.status === "Delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "paid";
    }
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};
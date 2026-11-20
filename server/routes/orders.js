import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = Router();

// POST /api/orders  body: { email, items: [{ productId, qty }] }
// Prices are read from the database, never trusted from the client.
router.post("/", async (req, res) => {
  const { email, items } = req.body;
  if (!email || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Email and at least one item are required." });
  }

  const products = await Product.find({ _id: { $in: items.map((i) => i.productId) } });

  const lines = [];
  for (const item of items) {
    const product = products.find((p) => p._id.equals(item.productId));
    if (!product) return res.status(400).json({ message: "One of the items is no longer available." });
    const qty = Math.min(99, Math.max(1, parseInt(item.qty, 10) || 1));
    lines.push({ product: product._id, name: product.name, price: product.price, qty });
  }

  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const order = await Order.create({ email, items: lines, total });
  res.status(201).json(order);
});

export default router;

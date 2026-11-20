import { Router } from "express";
import multer from "multer";
import Product from "../models/Product.js";
import { uploadBuffer, destroyImage } from "../config/cloudinary.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});

// GET /api/products?category=Tools
router.get("/", async (req, res) => {
  const { category } = req.query;
  const filter = category && category !== "All" ? { category } : {};
  const products = await Product.find(filter).sort({ category: 1, name: 1 });
  res.json(products);
});

// POST /api/products  (multipart: name, category, price, description, emoji, image)
router.post("/", upload.single("image"), async (req, res) => {
  const { name, category, price, description, emoji } = req.body;
  const data = { name, category, price: Number(price), description, emoji };

  if (req.file) {
    const up = await uploadBuffer(req.file.buffer, "velvet-nails/products");
    data.imageUrl = up.secure_url;
    data.imagePublicId = up.public_id;
  }

  const product = await Product.create(data);
  res.status(201).json(product);
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  await destroyImage(product.imagePublicId);
  res.json({ ok: true });
});

export default router;

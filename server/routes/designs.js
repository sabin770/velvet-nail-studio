import { Router } from "express";
import multer from "multer";
import Design from "../models/Design.js";
import { uploadBuffer, destroyImage } from "../config/cloudinary.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});

// GET /api/designs
router.get("/", async (req, res) => {
  const designs = await Design.find().sort({ featured: -1, createdAt: -1 });
  res.json(designs);
});

// POST /api/designs  (multipart: title, style, note, featured, image)
router.post("/", upload.single("image"), async (req, res) => {
  const { title, style, note, featured } = req.body;
  const data = { title, style, note, featured: featured === "true" };

  if (req.file) {
    const up = await uploadBuffer(req.file.buffer, "velvet-nails/designs");
    data.imageUrl = up.secure_url;
    data.imagePublicId = up.public_id;
  }

  const design = await Design.create(data);
  res.status(201).json(design);
});

// DELETE /api/designs/:id
router.delete("/:id", async (req, res) => {
  const design = await Design.findByIdAndDelete(req.params.id);
  if (!design) return res.status(404).json({ message: "Design not found" });
  await destroyImage(design.imagePublicId);
  res.json({ ok: true });
});

export default router;

import { Router } from "express";
import Service from "../models/Service.js";

const router = Router();

// GET /api/services
router.get("/", async (req, res) => {
  const services = await Service.find().sort({ sortOrder: 1, price: 1 });
  res.json(services);
});

// POST /api/services
router.post("/", async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
});

export default router;

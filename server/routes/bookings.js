import { Router } from "express";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";

const router = Router();
const TIME_SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// GET /api/bookings  (for an admin view later)
router.get("/", async (req, res) => {
  const bookings = await Booking.find().sort({ date: 1, time: 1 });
  res.json(bookings);
});

// POST /api/bookings
router.post("/", async (req, res) => {
  const { name, email, serviceId, date, time, notes } = req.body;

  if (!name || !email || !serviceId || !date || !time) {
    return res.status(400).json({ message: "Please fill in all required fields." });
  }
  if (!DATE_RE.test(date) || !TIME_SLOTS.includes(time)) {
    return res.status(400).json({ message: "Please choose a valid date and time." });
  }

  const service = await Service.findById(serviceId);
  if (!service) return res.status(400).json({ message: "That service doesn't exist." });

  const booking = await Booking.create({
    name,
    email,
    service: service._id,
    serviceName: service.name,
    date,
    time,
    notes: notes || "",
  });
  res.status(201).json(booking);
});

export default router;

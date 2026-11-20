import "dotenv/config"; // must be first so env vars exist for cloudinary/mongo
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import designRoutes from "./routes/designs.js";
import serviceRoutes from "./routes/services.js";
import productRoutes from "./routes/products.js";
import bookingRoutes from "./routes/bookings.js";
import orderRoutes from "./routes/orders.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/designs", designRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/orders", orderRoutes);

// Central error handler (Express 5 forwards async errors here automatically)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Something went wrong" });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`)))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

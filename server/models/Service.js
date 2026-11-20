import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    priceLabel: { type: String, default: "" }, // e.g. "from $10"; overrides price display
    durationMinutes: { type: Number, required: true, min: 5 },
    description: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);

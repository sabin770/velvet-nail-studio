import mongoose from "mongoose";

export const PRODUCT_CATEGORIES = ["Press-ons", "Extensions", "Removers", "Glue", "Tools", "Art"];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: PRODUCT_CATEGORIES, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    emoji: { type: String, default: "💅" }, // fallback when there is no photo
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);

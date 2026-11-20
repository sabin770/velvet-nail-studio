import mongoose from "mongoose";

// Style ids must match the client's STYLES list in client/src/constants.js
export const STYLE_IDS = [
  "solid", "french", "ombre", "polka", "stripes",
  "glitter", "marble", "chrome", "tips", "check",
];

const designSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    style: { type: String, enum: STYLE_IDS, required: true },
    note: { type: String, default: "", maxlength: 120 },
    imageUrl: { type: String, default: "" },        // Cloudinary secure_url
    imagePublicId: { type: String, default: "" },   // needed to delete from Cloudinary
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Design", designSchema);

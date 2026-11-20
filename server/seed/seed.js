// Run with: npm run seed
// WARNING: this clears existing designs, services, and products (bookings and orders are kept).
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Design from "../models/Design.js";
import Service from "../models/Service.js";
import Product from "../models/Product.js";

const DESIGNS = [
  { style: "solid", title: "Solid", note: "One clean color" },
  { style: "french", title: "French Tip", note: "Classic white tip" },
  { style: "ombre", title: "Ombré", note: "Soft color fade" },
  { style: "polka", title: "Polka Dot", note: "Playful dots" },
  { style: "stripes", title: "Stripes", note: "Crisp lines" },
  { style: "glitter", title: "Glitter", note: "Sparkle accent" },
  { style: "marble", title: "Marble", note: "Soft swirl" },
  { style: "chrome", title: "Chrome", note: "Metallic mirror" },
  { style: "tips", title: "Two-tone", note: "Dark base, bright top" },
  { style: "check", title: "Checkers", note: "Retro grid" },
];

const SERVICES = [
  { name: "Gel Manicure", price: 45, durationMinutes: 60, description: "Long-lasting gel color with shaping and cuticle care." },
  { name: "Full Set Extensions", price: 85, durationMinutes: 120, description: "Sculpted extensions in your choice of shape and length." },
  { name: "Fill-In", price: 55, durationMinutes: 75, description: "Maintenance for extensions, with new color and shaping." },
  { name: "Nail Art Add-On", price: 10, priceLabel: "from $10", durationMinutes: 15, description: "Hand-painted designs, glitter, chrome, or stickers." },
  { name: "Removal & Refresh", price: 25, durationMinutes: 45, description: "Safe gel or acrylic removal plus a hydrating treatment." },
  { name: "Spa Pedicure", price: 50, durationMinutes: 60, description: "Soak, scrub, massage, and polish for tired feet." },
];

const PRODUCTS = [
  { name: "Rosewater Press-Ons", category: "Press-ons", emoji: "💅", price: 18, description: "24 almond press-ons with reusable tabs." },
  { name: "Midnight Coffin Press-Ons", category: "Press-ons", emoji: "🖤", price: 20, description: "Glossy coffin shape in a deep midnight tone." },
  { name: "Chrome Dream Press-Ons", category: "Press-ons", emoji: "🪞", price: 22, description: "Mirror chrome finish on short squoval nails." },
  { name: "Full Set Starter Kit", category: "Extensions", emoji: "🧰", price: 34, description: "Tips, builder gel, base coat, and a file." },
  { name: "Builder Gel Base", category: "Extensions", emoji: "🫙", price: 15, description: "Self-leveling gel for strong, easy-to-file extensions." },
  { name: "Gentle Acetone Remover", category: "Removers", emoji: "🧴", price: 9, description: "Fast remover with conditioners to reduce dryness." },
  { name: "Gel-Off Soak Pads", category: "Removers", emoji: "🧻", price: 12, description: "Pre-soaked pads for gel and press-on removal." },
  { name: "Bond Strong Nail Glue", category: "Glue", emoji: "🧪", price: 8, description: "Clear, fast-setting glue that holds all week." },
  { name: "Precision File Set", category: "Tools", emoji: "🗂️", price: 10, description: "Three double-sided files, coarse to fine." },
  { name: "Cuticle Pusher & Nipper", category: "Tools", emoji: "✂️", price: 14, description: "Stainless steel tools with a leather case." },
  { name: "Glitter Dust Jar", category: "Art", emoji: "✨", price: 7, description: "Fine holographic glitter for accents and full sparkle." },
];

async function seed() {
  await connectDB();
  await Promise.all([Design.deleteMany({}), Service.deleteMany({}), Product.deleteMany({})]);

  await Design.insertMany(DESIGNS.map((d, i) => ({ ...d, featured: i < 3 })));
  await Service.insertMany(SERVICES.map((s, i) => ({ ...s, sortOrder: i })));
  await Product.insertMany(PRODUCTS);

  console.log(`Seeded ${DESIGNS.length} designs, ${SERVICES.length} services, ${PRODUCTS.length} products.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

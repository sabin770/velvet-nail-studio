export const SHAPES = ["almond", "square", "round", "coffin", "stiletto"];
export const LENGTHS = ["short", "medium", "long"];

// Rendered height in px for each length (the morph animates between these too)
export const LENGTH_PX = { short: 92, medium: 118, long: 146 };

export const COLORS = [
  { name: "Rose Petal", hex: "#e88aa0" },
  { name: "Berry Wine", hex: "#8e2c57" },
  { name: "Nude Sand", hex: "#dcb9a0" },
  { name: "Midnight", hex: "#2a2440" },
  { name: "Mint Cream", hex: "#a8dcc8" },
  { name: "Lilac Haze", hex: "#c7a8e0" },
  { name: "Gold Dust", hex: "#d9a441" },
];

// Style ids must match server/models/Design.js STYLE_IDS
export const STYLES = [
  { id: "solid", name: "Solid", note: "One clean color" },
  { id: "french", name: "French Tip", note: "Classic white tip" },
  { id: "ombre", name: "Ombré", note: "Soft color fade" },
  { id: "polka", name: "Polka Dot", note: "Playful dots" },
  { id: "stripes", name: "Stripes", note: "Crisp lines" },
  { id: "glitter", name: "Glitter", note: "Sparkle accent" },
  { id: "marble", name: "Marble", note: "Soft swirl" },
  { id: "chrome", name: "Chrome", note: "Metallic mirror" },
  { id: "tips", name: "Two-tone", note: "Dark base, bright top" },
  { id: "check", name: "Checkers", note: "Retro grid" },
];

export const TIME_SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];

export const SHOP_CATEGORIES = ["All", "Press-ons", "Extensions", "Removers", "Glue", "Tools", "Art"];

export const todayLocal = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NailShape from "../components/NailShape.jsx";
import { COLORS } from "../constants.js";

// Hero shows five nails that cycle through shapes so the morph is visible
const SHAPE_CYCLE = [
  ["almond", "coffin", "round", "square", "almond"],
  ["coffin", "stiletto", "almond", "round", "coffin"],
];

const LOOKS = [
  { length: "long", color: COLORS[0].hex, design: "ombre" },
  { length: "medium", color: COLORS[1].hex, design: "marble" },
  { length: "long", color: COLORS[5].hex, design: "glitter" },
  { length: "medium", color: COLORS[4].hex, design: "stripes" },
  { length: "short", color: COLORS[6].hex, design: "chrome" },
];

export default function Home() {
  const [set, setSet] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSet((s) => (s + 1) % SHAPE_CYCLE.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">Extensions · Nail art · Gel</div>
            <h1>Nails that feel <em>like you.</em></h1>
            <p>Soft extensions, clean shapes, and designs made to order. Pick a look, try it on the preview, and book your appointment.</p>
            <div className="hero-actions">
              <Link className="btn" to="/design-your-set">Design your set</Link>
              <Link className="btn ghost" to="/services">See services</Link>
            </div>
          </div>
          <div className="hero-hands" aria-hidden="true">
            {LOOKS.map((look, i) => (
              <NailShape key={i} {...look} shape={SHAPE_CYCLE[set][i]} />
            ))}
          </div>
        </div>
      </header>

      <section className="page">
        <div className="wrap quick-links">
          <Link to="/designs" className="design-card"><h3>Designs</h3><p>Browse ten finishes</p></Link>
          <Link to="/design-your-set" className="design-card"><h3>Design your set</h3><p>Try shapes and colors</p></Link>
          <Link to="/services" className="design-card"><h3>Services</h3><p>Prices and times</p></Link>
          <Link to="/shop" className="design-card"><h3>Shop</h3><p>Take the salon home</p></Link>
        </div>
      </section>
    </>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NailShape from "../components/NailShape.jsx";
import { api } from "../api.js";
import { COLORS } from "../constants.js";

export default function Designs() {
  const [designs, setDesigns] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.designs().then(setDesigns).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="page gallery">
      <div className="wrap">
        <header className="section-head">
          <div>
            <div className="eyebrow">Inspiration</div>
            <h1>Designs we love</h1>
          </div>
          <p className="muted narrow">Tap any design to load it into the builder.</p>
        </header>

        {error && <p className="notice">Couldn't load designs: {error}</p>}
        {designs && designs.length === 0 && (
          <p className="notice">No designs yet. Run <code>npm run seed</code> in the server folder.</p>
        )}

        <div className="gallery-grid">
          {(designs || []).map((d) => (
            <Link key={d._id} to={`/design-your-set?style=${d.style}`} className="design-card">
              {d.imageUrl ? (
                <img src={d.imageUrl} alt={d.title} className="design-photo" loading="lazy" />
              ) : (
                <div className="trio">
                  <NailShape shape="almond" length="medium" color={COLORS[0].hex} design={d.style} />
                  <NailShape shape="almond" length="long" color={COLORS[1].hex} design={d.style} />
                  <NailShape shape="almond" length="medium" color={COLORS[5].hex} design={d.style} />
                </div>
              )}
              <h3>{d.title}</h3>
              <p>{d.note}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

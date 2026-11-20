import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NailShape from "../components/NailShape.jsx";
import { SHAPES, LENGTHS, COLORS, STYLES, cap } from "../constants.js";

const PREVIEW_SCALES = [0.88, 1, 1.05, 1, 0.88];

function Chip({ active, onClick, children }) {
  return (
    <button type="button" className={`opt ${active ? "on" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function DesignYourSet() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const fromGallery = STYLES.some((s) => s.id === params.get("style")) ? params.get("style") : "solid";

  const [look, setLook] = useState({ shape: "almond", length: "medium", colorIdx: 0, style: fromGallery });
  const color = COLORS[look.colorIdx];
  const styleName = STYLES.find((s) => s.id === look.style)?.name || "Solid";
  const summary = `${styleName} in ${color.name}, ${look.shape} shape, ${look.length} length`;

  const update = (patch) => setLook((l) => ({ ...l, ...patch }));

  return (
    <section className="page designer">
      <div className="wrap">
        <header className="section-head">
          <div>
            <div className="eyebrow">Try it on</div>
            <h1>Build your set</h1>
          </div>
        </header>

        <div className="designer-grid">
          <div className="hand">
            <div className="hand-row">
              {PREVIEW_SCALES.map((scale, i) => (
                <NailShape
                  key={i}
                  shape={look.shape}
                  length={look.length}
                  color={color.hex}
                  design={look.style}
                  scale={scale}
                />
              ))}
            </div>
            <div className="hand-label">Preview, not final. Your nail tech will fine-tune the fit.</div>
          </div>

          <div className="panel">
            <div>
              <div className="opt-label">Shape</div>
              <div className="options">
                {SHAPES.map((s) => (
                  <Chip key={s} active={look.shape === s} onClick={() => update({ shape: s })}>{cap(s)}</Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="opt-label">Length</div>
              <div className="options">
                {LENGTHS.map((l) => (
                  <Chip key={l} active={look.length === l} onClick={() => update({ length: l })}>{cap(l)}</Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="opt-label">Color</div>
              <div className="swatches">
                {COLORS.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    aria-label={c.name}
                    className={`swatch ${look.colorIdx === i ? "on" : ""}`}
                    style={{ background: c.hex }}
                    onClick={() => update({ colorIdx: i })}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="opt-label">Design</div>
              <div className="options">
                {STYLES.map((s) => (
                  <Chip key={s.id} active={look.style === s.id} onClick={() => update({ style: s.id })}>{s.name}</Chip>
                ))}
              </div>
            </div>

            <div className="summary">
              Your look: <strong>{styleName}</strong> in {color.name}, {look.shape} shape, {look.length} length.
            </div>

            <button
              className="btn"
              type="button"
              onClick={() => navigate("/book", { state: { look: summary } })}
            >
              Book this look
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

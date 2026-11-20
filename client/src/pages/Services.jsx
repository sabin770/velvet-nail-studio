import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Services() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.services().then(setServices).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="page">
      <div className="wrap">
        <header className="section-head">
          <div>
            <div className="eyebrow">Menu</div>
            <h1>Services</h1>
          </div>
        </header>

        {error && <p className="notice">Couldn't load services: {error}</p>}

        <div className="services-grid">
          {services.map((s) => (
            <article key={s._id} className="service">
              <h3>{s.name}</h3>
              <div className="price">{s.priceLabel || `$${s.price}`}</div>
              <div className="meta">{s.durationMinutes} min · {s.description}</div>
              <button
                className="btn ghost"
                onClick={() => navigate("/book", { state: { serviceId: s._id } })}
              >
                Book this
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

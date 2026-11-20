import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api.js";
import { TIME_SLOTS, todayLocal } from "../constants.js";

export default function Book() {
  // Pages like Services and Design your set pass prefill data through router state
  const location = useLocation();
  const prefill = location.state || {};

  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    serviceId: prefill.serviceId || "",
    date: "",
    time: TIME_SLOTS[0],
    notes: prefill.look ? `Look: ${prefill.look}` : "",
  });
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.services()
      .then((list) => {
        setServices(list);
        setForm((f) => ({ ...f, serviceId: f.serviceId || list[0]?._id || "" }));
      })
      .catch((e) => setError(e.message));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const booking = await api.createBooking(form);
      setDone(booking);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <section className="booking">
        <div className="wrap page">
          <div className="confirm">
            Thanks, {done.name}! Your request for {done.serviceName} on {done.date} at {done.time} was received.
            We'll confirm at {done.email}.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="booking page">
      <div className="wrap booking-grid">
        <div>
          <div className="eyebrow">Book your visit</div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,2.8rem)", margin: "8px 0 14px" }}>Pick a time that works</h2>
          <p>Extensions take about 2 hours. Art add-ons can extend your visit. Requests are saved to our system and confirmed by email.</p>
        </div>

        <form className="form" onSubmit={submit}>
          <label>Your name
            <input required maxLength={60} placeholder="Jamie Lee" value={form.name} onChange={set("name")} />
          </label>
          <label>Email
            <input type="email" required placeholder="you@example.com" value={form.email} onChange={set("email")} />
          </label>
          <label>Service
            <select required value={form.serviceId} onChange={set("serviceId")}>
              {services.map((s) => (
                <option key={s._id} value={s._id}>{s.name} ({s.priceLabel || `$${s.price}`})</option>
              ))}
            </select>
          </label>
          <div className="row2">
            <label>Date
              <input type="date" required min={todayLocal()} value={form.date} onChange={set("date")} />
            </label>
            <label>Time
              <select required value={form.time} onChange={set("time")}>
                {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
          </div>
          <label>Notes (optional)
            <input maxLength={200} placeholder="Shape, length, or a design you saved" value={form.notes} onChange={set("notes")} />
          </label>

          {error && <p className="notice">{error}</p>}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Sending…" : "Request booking"}
          </button>
        </form>
      </div>
    </section>
  );
}

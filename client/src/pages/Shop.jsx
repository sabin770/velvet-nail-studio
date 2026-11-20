import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useStore } from "../store.jsx";
import { SHOP_CATEGORIES } from "../constants.js";

export default function Shop() {
  const { cart, addToCart, setQty, clearCart, toast } = useStore();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.products().then(setProducts).catch((e) => setError(e.message));
  }, []);

  const visible = products.filter((p) => category === "All" || p.category === category);
  const lines = cart
    .map((l) => ({ ...l, product: products.find((p) => p._id === l.productId) }))
    .filter((l) => l.product);
  const total = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  async function checkout() {
    setError("");
    if (!email) {
      setError("Add your email so we can send your receipt.");
      return;
    }
    setBusy(true);
    try {
      await api.createOrder({ email, items: cart.map(({ productId, qty }) => ({ productId, qty })) });
      clearCart();
      toast("Order placed! (demo, nothing charged)");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page shop">
      <div className="wrap">
        <header className="section-head">
          <div>
            <div className="eyebrow">Shop</div>
            <h1>Take the salon home</h1>
          </div>
          <p className="muted narrow">Press-ons, glue, removers, and tools. Every item is one we use in the studio.</p>
        </header>

        <div className="shop-layout">
          <div>
            <div className="shop-cats">
              {SHOP_CATEGORIES.map((c) => (
                <button key={c} className={`opt ${category === c ? "on" : ""}`} onClick={() => setCategory(c)}>
                  {c}
                </button>
              ))}
            </div>

            <div className="shop-grid">
              {visible.map((p) => (
                <div key={p._id} className="shop-card">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="shop-photo" loading="lazy" />
                  ) : (
                    <div className="shop-emo">{p.emoji}</div>
                  )}
                  <div className="shop-kind">{p.category}</div>
                  <div className="shop-name">{p.name}</div>
                  <p className="shop-desc">{p.description}</p>
                  <div className="shop-row">
                    <span className="shop-price">${p.price.toFixed(2)}</span>
                    <button className="btn" onClick={() => addToCart(p._id)} disabled={!p.inStock}>
                      {p.inStock ? "Add" : "Sold out"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="panel cart-panel">
            <h3>Your cart ({cart.reduce((n, l) => n + l.qty, 0)})</h3>
            {lines.length === 0 && <p className="shop-desc">Your cart is empty.</p>}
            {lines.map((l) => (
              <div key={l.productId} className="cart-line">
                <span>{l.product.emoji} {l.product.name}</span>
                <div className="qty">
                  <button onClick={() => setQty(l.productId, l.qty - 1)} aria-label="Remove one">−</button>
                  <span>{l.qty}</span>
                  <button onClick={() => setQty(l.productId, l.qty + 1)} aria-label="Add one">+</button>
                </div>
              </div>
            ))}
            <div className="cart-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>

            <label className="field">
              Receipt email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </label>

            {error && <p className="notice">{error}</p>}
            <button className="btn" style={{ width: "100%" }} onClick={checkout} disabled={!lines.length || busy}>
              {busy ? "Placing order…" : "Checkout"}
            </button>
            <p className="shop-desc">Demo shop. Nothing is charged.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

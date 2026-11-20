import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const StoreContext = createContext(null);
const CART_KEY = "velvet-cart";

export function StoreProvider({ children }) {
  // cart: [{ productId, qty }]
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
  });
  const [toastMsg, setToastMsg] = useState("");
  const timer = useRef(null);

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastMsg(""), 2200);
  }, []);

  const addToCart = useCallback((productId) => {
    setCart((c) => {
      const line = c.find((l) => l.productId === productId);
      return line
        ? c.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 1 } : l))
        : [...c, { productId, qty: 1 }];
    });
    toast("Added to cart ✓");
  }, [toast]);

  // qty of 0 removes the line
  const setQty = useCallback((productId, qty) => {
    setCart((c) => (qty <= 0
      ? c.filter((l) => l.productId !== productId)
      : c.map((l) => (l.productId === productId ? { ...l, qty } : l))));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((n, l) => n + l.qty, 0);

  return (
    <StoreContext.Provider value={{ cart, cartCount, addToCart, setQty, clearCart, toast }}>
      {children}
      <div className={`toast ${toastMsg ? "show" : ""}`} role="status" aria-live="polite">{toastMsg}</div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

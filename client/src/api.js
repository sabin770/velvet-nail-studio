async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}

const post = (path, body) => request(path, { method: "POST", body: JSON.stringify(body) });

export const api = {
  designs: () => request("/designs"),
  services: () => request("/services"),
  products: (category) => request(`/products${category && category !== "All" ? `?category=${encodeURIComponent(category)}` : ""}`),
  createBooking: (body) => post("/bookings", body),
  createOrder: (body) => post("/orders", body),
};

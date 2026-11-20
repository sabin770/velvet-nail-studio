import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import Designs from "./pages/Designs.jsx";
import DesignYourSet from "./pages/DesignYourSet.jsx";
import Services from "./pages/Services.jsx";
import Shop from "./pages/Shop.jsx";
import Book from "./pages/Book.jsx";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/designs" element={<Designs />} />
          <Route path="/design-your-set" element={<DesignYourSet />} />
          <Route path="/services" element={<Services />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/book" element={<Book />} />
          <Route path="*" element={<p className="wrap page">Page not found.</p>} />
        </Routes>
      </main>
      <footer>
        Velvet Nail Studio · 214 Maple Lane · Tue–Sun 10 AM – 7 PM · Demo site, not a real business
      </footer>
    </>
  );
}

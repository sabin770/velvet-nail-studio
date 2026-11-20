import { Link, NavLink } from "react-router-dom";
import { useStore } from "../store.jsx";

export default function Nav() {
  const { cartCount } = useStore();
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="logo">Velvet Nail Studio</Link>
        <div className="nav-links">
          <NavLink to="/designs">Designs</NavLink>
          <NavLink to="/design-your-set">Design your set</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/shop">Shop ({cartCount})</NavLink>
          <NavLink to="/book">Book</NavLink>
        </div>
        <Link className="btn" to="/book">Book now</Link>
      </div>
    </nav>
  );
}

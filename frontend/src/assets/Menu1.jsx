import { Link } from "react-router-dom";

function Menu1() {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/products">Products</Link>
    </nav>
  );
}

export default Menu1;
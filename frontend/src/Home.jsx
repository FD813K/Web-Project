import { Link } from "react-router-dom";
import { PRODUCT_CATEGORIES } from "./constants/productCategories.js";

function Home() {
  return (
    <>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg bg-dark border-bottom border-secondary"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <span id="app-title">Marketplace</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>
              
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            </ul>

            <select className="form-select me-2" style={{ width: "180px" }} defaultValue="All Categories">
              <option>All Categories</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <div className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search products..."
              />
              <button className="btn btn-outline-light" type="button">
                Search
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Carousel */}
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/electronics.png" className="d-block w-100" alt="Electronics" />
          </div>
          <div className="carousel-item">
            <img src="/Clothing.png" className="d-block w-100" alt="Clothing" />
          </div>
          <div className="carousel-item">
            <img src="/Accessibilities.png" className="d-block w-100" alt="Accessories" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* Buy & Sell Cards */}
      <div className="container mt-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card bg-dark text-light shadow border-secondary">
              <img src="/buy.png" className="card-img-top" alt="Buy Products" />
              <div className="card-body text-center bg-dark">
                <h5 className="card-title">Buy Products</h5>
                <p className="card-text">Browse and purchase products from different categories.</p>
                <Link className="btn btn-primary" to="/buy">Shop Now</Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-dark text-light shadow border-secondary">
              <img src="/sell.png" className="card-img-top" alt="Sell Products" />
              <div className="card-body text-center bg-dark">
                <h5 className="card-title">Sell Products</h5>
                <p className="card-text">List your items and start selling to customers.</p>
                <Link className="btn btn-success" to="/sell">Start Selling</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container-fluid mt-5">
        <h2 className="text-center text-light mb-4">Browse Categories</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card bg-dark text-light border-secondary text-center">
              <img src="/card elec.png" className="card-img-top" alt="Electronics" />
              <div className="card-body">
                <h5>Electronics</h5>
                <Link className="btn btn-primary" to="/buy?category=electronics">Shop Electronics</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-dark text-light border-secondary text-center">
              <img src="/card clothing.png" className="card-img-top" alt="Clothing" />
              <div className="card-body">
                <h5>Clothing</h5>
                <Link className="btn btn-primary" to="/buy?category=clothing">Shop Clothing</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-dark text-light border-secondary text-center">
              <img src="/card accessories.png" className="card-img-top" alt="Accessories" />
              <div className="card-body">
                <h5>Accessories</h5>
                <Link className="btn btn-primary" to="/buy?category=accessories">Shop Accessories</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="container-fluid mt-5">
        <div className="row text-center text-light">
          <div className="col-md-4"><h2>10,000+</h2><p>Products</p></div>
          <div className="col-md-4"><h2>2,500+</h2><p>Sellers</p></div>
          <div className="col-md-4"><h2>15,000+</h2><p>Customers</p></div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="container mt-5">
        <div className="p-4 bg-secondary text-light rounded">
          <h2 style={{ fontFamily: "Times New Roman", fontWeight: "bold" }}>Why Choose Us?</h2>
          <ul>
            <li>Secure Payments</li>
            <li>Fast Delivery</li>
            <li>Trusted Sellers</li>
            <li>24/7 Customer Support</li>
          </ul>
        </div>
      </div>

      {/* Reviews */}
      <div className="container mt-5">
        <h2 className="text-center text-light mb-4">Customer Reviews</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card bg-dark text-light border-secondary">
              <div className="card-body"><h5>⭐⭐⭐⭐⭐</h5><p>Great marketplace experience!</p><small>- Ahmed</small></div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-dark text-light border-secondary">
              <div className="card-body"><h5>⭐⭐⭐⭐⭐</h5><p>Easy buying and selling process.</p><small>- Sarah</small></div>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="container mt-5">
        <div className="p-4 bg-secondary text-light rounded">
          <h2>About Marketplace</h2>
          <p>This marketplace website allows users to buy and sell products online. It is built using React and Bootstrap as part of a Web Technologies project.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-4 mt-5 border-top border-secondary">
        <h5>Marketplace</h5>
        <p>Web Technologies Project</p>
        <p>&copy; 2026 Marketplace. All Rights Reserved.</p>
        <small>References: Bootstrap Documentation | React Documentation</small>
      </footer>
    </>
  );
}

export default Home;

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getApiErrorMessage, getProductImageUrl, getProductsAxiosFunction } from "./Service/api.js";
import { PRODUCT_CATEGORIES } from "./constants/productCategories.js";

function Buy() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category") || "";
  const selectedCategory = PRODUCT_CATEGORIES.find(
    (category) => category.toLowerCase() === requestedCategory.toLowerCase()
  ) || "All Categories";
  const filteredProducts = selectedCategory === "All Categories"
    ? products
    : products.filter((product) => product.category === selectedCategory);
  const visibleProducts = filteredProducts.filter((product) =>
    product.productName.toLowerCase().includes(searchText.trim().toLowerCase())
  );

  useEffect(() => {
    async function fetchProducts() {
      try {
        setProducts(await getProductsAxiosFunction());
      } catch (error) {
        console.error("Error fetching products", error);
        setErrorMessage(getApiErrorMessage(error, "Unable to load products from the server."));
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="buy-page">
      <link rel="stylesheet" href="/createproduct.css" />
      <Link to="/" className="back-btn">← Back to Home</Link>
      <nav className="quicknav" aria-label="Marketplace pages">
        <Link to="/buy">Buy</Link><Link to="/sell">Sell</Link><Link to="/myproducts">My Products</Link><Link to="/complaints">Complaints</Link><Link to="/contact">Contact</Link>
      </nav>
      <h1>Buy Products</h1>
      <div className="standard-form buy-form" aria-label="Product search">
        <label htmlFor="search"><span>Search Product:</span></label>
        <input id="search" type="text" placeholder="Enter product name" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
        <label htmlFor="category"><span>Category:</span></label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(event) => {
            const category = event.target.value;
            const nextSearchParams = new URLSearchParams(searchParams);
            if (category === "All Categories") {
              nextSearchParams.delete("category");
            } else {
              nextSearchParams.set("category", category.toLowerCase());
            }
            setSearchParams(nextSearchParams);
          }}
        >
          <option>All Categories</option>
          {PRODUCT_CATEGORIES.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <h2>Available Products</h2>

        {loading && <p>Loading products...</p>}
        {errorMessage && <p className="text-danger">{errorMessage}</p>}

        {visibleProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <article key={product.productId} className="product-card">
              {(product.productImages || []).map((image, index) => (
                <img
                  key={`${product.productId}-${index}`}
                  src={getProductImageUrl(image)}
                  alt={`${product.productName} ${index + 1}`}
                />
              ))}
              <h3>{product.productName}</h3>
              <p>{product.productDescription}</p>
              <p><strong>Product ID:</strong> {product.productId}</p>
              <p><strong>Category:</strong> {product.category || "Uncategorized"}</p>
              {product.price !== undefined && <p><strong>Price:</strong> ${product.price}</p>}
              <button type="button">Buy Now</button>
            </article>
          ))
        ) : !loading && !errorMessage ? (
          <p>
            {selectedCategory === "All Categories"
              ? "No products are listed yet."
              : searchText
                ? `No products match "${searchText}".`
                : `No products are listed in ${selectedCategory} yet.`}
          </p>
        ) : null}
      </div>
    </main>
  );
}

export default Buy;

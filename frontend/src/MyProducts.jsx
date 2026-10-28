import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PRODUCT_CATEGORIES } from "./constants/productCategories.js";
import {
  deleteProductAxiosFunction,
  getApiErrorMessage,
  getProductImageUrl,
  getProductsAxiosFunction,
  updateProductAxiosFunction,
} from "./Service/api.js";

const optionalNumber = (label, wholeNumber = false) => z.preprocess(
  (value) => value === "" || Number.isNaN(value) ? undefined : value,
  (wholeNumber
    ? z.number().int(`${label} must be a whole number`)
    : z.number()
  ).min(0, `${label} cannot be negative`).optional()
);

const editProductSchema = z.object({
  editId: z.string().min(1, "Product ID is required").max(6, "Product ID must be at most 6 characters"),
  editName: z.string().min(2, "Name must be at least 2 characters").max(10, "Name must be at most 10 characters"),
  editCategory: z.enum(PRODUCT_CATEGORIES, { error: "Choose a category" }),
  editPrice: optionalNumber("Price"),
  editStock: optionalNumber("Stock", true),
  editDescription: z.string().min(10, "Description must be at least 10 characters").max(20, "Description must be at most 20 characters"),
  editImages: z.any().optional(),
});

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(editProductSchema) });

  async function loadProducts() {
    setLoading(true);
    try {
      setProducts(await getProductsAxiosFunction());
      setMessage("");
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Unable to load products from the backend."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    getProductsAxiosFunction()
      .then((result) => {
        if (active) setProducts(result);
      })
      .catch((error) => {
        if (active) setMessage(getApiErrorMessage(error, "Unable to load products from the backend."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function startEditing(product) {
    setSelectedProductId(product.productId);
    reset({
      editId: product.productId,
      editName: product.productName,
      editCategory: product.category,
      editPrice: product.price ?? "",
      editStock: product.stock ?? "",
      editDescription: product.productDescription,
      editImages: undefined,
    });
    document.getElementById("editSection")?.scrollIntoView({ behavior: "smooth" });
  }

  async function myFormSubmissionFunction(data) {
    setMessage("");
    try {
      const result = await updateProductAxiosFunction(data.editId, {
        productId: data.editId,
        productName: data.editName,
        category: data.editCategory,
        price: data.editPrice,
        stock: data.editStock,
        productDescription: data.editDescription,
        productImages: data.editImages,
      });
      setMessage(result.message);
      await loadProducts();
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Unable to save product changes."));
    }
  }

  async function deleteProduct(productId) {
    if (!window.confirm(`Delete product ${productId}?`)) {
      return;
    }
    setMessage("");
    try {
      const result = await deleteProductAxiosFunction(productId);
      setMessage(result.message);
      if (selectedProductId === productId) {
        setSelectedProductId("");
        reset();
      }
      await loadProducts();
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Unable to delete product."));
    }
  }

  return (
    <main>
      <link rel="stylesheet" href="/myproducts.css" />
      <Link to="/" className="back-btn">← Back to Home</Link>
      <nav className="quicknav" aria-label="Marketplace pages">
        <Link to="/buy">Buy</Link>
        <Link to="/sell">Sell</Link>
        <Link to="/myproducts">My Products</Link>
        <Link to="/complaints">Complaints</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <h1>My Products</h1>
      {message && <p className="helper-link" role="status">{message}</p>}

      <div id="editSection" className="edit-box">
        <h2>{selectedProductId ? `Edit Product ${selectedProductId}` : "Edit Product"}</h2>
        <form onSubmit={handleSubmit(myFormSubmissionFunction)} id="editForm">
          <label htmlFor="editId">Product ID:</label>
          <input type="text" id="editId" maxLength="6" required placeholder="Select a product below" {...register("editId")} />
          {errors.editId && <span className="text-danger">{errors.editId.message}</span>}

          <label htmlFor="editName">Name:</label>
          <input type="text" id="editName" maxLength="10" {...register("editName")} />
          {errors.editName && <span className="text-danger">{errors.editName.message}</span>}

          <label htmlFor="editCategory">Category:</label>
          <select id="editCategory" defaultValue="" {...register("editCategory")}>
            <option value="" disabled>Select a category</option>
            {PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          {errors.editCategory && <span className="text-danger">{errors.editCategory.message}</span>}

          <label htmlFor="editPrice">Price ($):</label>
          <input type="number" id="editPrice" min="0" step="0.01" {...register("editPrice", { setValueAs: (value) => value === "" ? undefined : Number(value) })} />
          {errors.editPrice && <span className="text-danger">{errors.editPrice.message}</span>}

          <label htmlFor="editStock">Stock:</label>
          <input type="number" id="editStock" min="0" step="1" {...register("editStock", { setValueAs: (value) => value === "" ? undefined : Number(value) })} />
          {errors.editStock && <span className="text-danger">{errors.editStock.message}</span>}

          <label htmlFor="editDescription">Description:</label>
          <textarea id="editDescription" rows="4" maxLength="20" {...register("editDescription")} />
          {errors.editDescription && <span className="text-danger">{errors.editDescription.message}</span>}

          <label htmlFor="editImages">Replace images (optional):</label>
          <input type="file" id="editImages" accept="image/*" multiple {...register("editImages")} />

          <div className="edit-buttons">
            <input type="submit" value={isSubmitting ? "Saving..." : "Save Changes"} disabled={isSubmitting} />
            <Link to="/sell">Back to Sell</Link>
          </div>
        </form>
      </div>

      <h2 className="list-heading">Your Listings</h2>
      {loading && <p className="empty-msg">Loading products...</p>}
      {!loading && products.length === 0 && <p className="empty-msg">No products listed yet.</p>}
      <div id="productList" className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.productId}>
            {product.productImages?.map((image, index) => (
              <img key={`${product.productId}-${index}`} src={getProductImageUrl(image)} alt={`${product.productName} ${index + 1}`} />
            ))}
            <h3>{product.productName}</h3>
            <p><strong>Product ID:</strong> {product.productId}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p>{product.productDescription}</p>
            <div className="card-buttons">
              <button type="button" onClick={() => startEditing(product)}>Edit</button>
              <button className="delete-btn" type="button" onClick={() => deleteProduct(product.productId)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

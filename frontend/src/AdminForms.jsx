import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PRODUCT_CATEGORIES } from "./constants/productCategories.js";
import { useEffect, useState } from "react";
import {
  addProductAxiosFunction,
  getComplaintsAxiosFunction,
  deleteProductAxiosFunction,
  getApiErrorMessage,
  getProductsAxiosFunction,
  updateProductAxiosFunction,
  updateComplaintAxiosFunction,
} from "./Service/api.js";

const addProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required").max(6, "Product ID must be at most 6 characters"),
  productName: z.string().min(2).max(10),
  productDescription: z.string().min(10, "Description must be at least 10 characters").max(20, "Description must be at most 20 characters"),
  category: z.enum(PRODUCT_CATEGORIES, { error: "Choose a product category" }),
  price: z.number({ error: "Enter a price" }).min(0),
  stock: z.number({ error: "Enter a stock amount" }).int().min(0),
  productImages: z.custom((files) => files?.length > 0, "Choose at least one image"),
});
const updateProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required").max(6, "Product ID must be at most 6 characters"),
  productName: z.union([
    z.string().min(2, "Product name must be at least 2 characters").max(10, "Product name must be at most 10 characters"),
    z.literal(""),
  ]).optional(),
  productDescription: z.union([
    z.string().min(10, "Description must be at least 10 characters").max(20, "Description must be at most 20 characters"),
    z.literal(""),
  ]).optional(),
  category: z.union([z.enum(PRODUCT_CATEGORIES), z.literal("")]).optional(),
  price: z.number({ error: "Enter a valid price" }).min(0, "Price cannot be negative").optional(),
  stock: z.number({ error: "Enter a valid stock amount" }).int().min(0, "Stock cannot be negative").optional(),
  productImages: z.any().optional(),
});
const processComplaintSchema = z.object({
  complaintId: z.number({ error: "Enter a complaint ID" }).int().min(1, "Enter a complaint ID"),
  status: z.string().min(1).max(70, "Status must be at most 70 characters"),
  reply: z.string().max(70, "Reply must be at most 70 characters").optional(),
});
const deleteProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required").max(6, "Product ID must be at most 6 characters"),
});

export default function AdminForms() {
  const [products, setProducts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [complaintMessage, setComplaintMessage] = useState("");
  const [productMessage, setProductMessage] = useState("");
  const [productsLoading, setProductsLoading] = useState(true);
  const location = useLocation();
  const formIds = ["add-product", "update-product", "review-products", "review-complaints", "process-complaint", "delete-product"];
  const selectedId = location.hash.slice(1);
  const activeForm = formIds.includes(selectedId) ? selectedId : formIds[0];

  const {
    register: registerAddProduct,
    handleSubmit: handleSubmitAddProduct,
    formState: { errors: errorsAddProduct },
  } = useForm({ resolver: zodResolver(addProductSchema) });
  const {
    register: registerUpdateProduct,
    handleSubmit: handleSubmitUpdateProduct,
    formState: { errors: errorsUpdateProduct },
  } = useForm({ resolver: zodResolver(updateProductSchema) });
  const {
    register: registerProcessComplaint,
    handleSubmit: handleSubmitProcessComplaint,
    formState: { errors: errorsProcessComplaint },
  } = useForm({ resolver: zodResolver(processComplaintSchema) });
  const {
    register: registerDeleteProduct,
    handleSubmit: handleSubmitDeleteProduct,
    formState: { errors: errorsDeleteProduct },
  } = useForm({ resolver: zodResolver(deleteProductSchema) });

  async function loadProducts() {
    setProductsLoading(true);
    try {
      setProducts(await getProductsAxiosFunction());
    } catch (error) {
      setProductMessage(getApiErrorMessage(error, "Unable to load products from the backend."));
    } finally {
      setProductsLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    getProductsAxiosFunction()
      .then((result) => {
        if (active) setProducts(result);
      })
      .catch((error) => {
        if (active) setProductMessage(getApiErrorMessage(error, "Unable to load products from the backend."));
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    getComplaintsAxiosFunction()
      .then((result) => {
        if (active) setComplaints(result);
      })
      .catch((error) => {
        if (active) setComplaintMessage(getApiErrorMessage(error, "Unable to load complaints."));
      })
      .finally(() => {
        if (active) setComplaintsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function addProduct(data) {
    setProductMessage("");
    try {
      const result = await addProductAxiosFunction(data);
      setProductMessage(result.message);
      await loadProducts();
    } catch (error) {
      setProductMessage(getApiErrorMessage(error, "Unable to add product."));
    }
  }

  async function updateProduct(data) {
    setProductMessage("");
    try {
      const result = await updateProductAxiosFunction(data.productId, data);
      setProductMessage(result.message);
      await loadProducts();
    } catch (error) {
      setProductMessage(getApiErrorMessage(error, "Unable to update product."));
    }
  }

  async function deleteProduct(data) {
    setProductMessage("");
    try {
      const result = await deleteProductAxiosFunction(data.productId);
      setProductMessage(result.message);
      await loadProducts();
    } catch (error) {
      setProductMessage(getApiErrorMessage(error, "Unable to delete product."));
    }
  }

  async function processComplaint(data) {
    setComplaintMessage("");
    try {
      const result = await updateComplaintAxiosFunction(data.complaintId, data);
      setComplaintMessage(result.message);
      setComplaints(await getComplaintsAxiosFunction());
    } catch (error) {
      setComplaintMessage(getApiErrorMessage(error, "Unable to process complaint."));
    }
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/stakeholders.css" />
      
      <Link to="/" className="back-btn">← Back to Home</Link>
      <main className="form-panel-page">
        <h1>Admin</h1>
        <nav className="form-panel-nav" aria-label="Admin forms">
          <Link to="/admin#add-product" aria-current={activeForm === "add-product" ? "page" : undefined}>Add product</Link>
          <Link to="/admin#update-product" aria-current={activeForm === "update-product" ? "page" : undefined}>Update product</Link>
          <Link to="/admin#review-products" aria-current={activeForm === "review-products" ? "page" : undefined}>Review products</Link>
          <Link to="/admin#review-complaints" aria-current={activeForm === "review-complaints" ? "page" : undefined}>Review complaints</Link>
          <Link to="/admin#process-complaint" aria-current={activeForm === "process-complaint" ? "page" : undefined}>Process complaint</Link>
          <Link to="/admin#delete-product" aria-current={activeForm === "delete-product" ? "page" : undefined}>Delete product</Link>
        </nav>

        <section className={activeForm === "add-product" ? "form-panel active-panel" : "form-panel"} id="add-product">
          <h2>Insert product</h2>
          <form className="simple-form" onSubmit={handleSubmitAddProduct(addProduct)}>
            <label htmlFor="admin-new-product-id">Product ID</label>
            <input id="admin-new-product-id" type="text" maxLength="6" required {...registerAddProduct("productId")} />
            {errorsAddProduct.productId && <span className="text-danger">{errorsAddProduct.productId.message}</span>}
            <label htmlFor="admin-new-product-name">Name</label>
            <input id="admin-new-product-name" type="text" maxLength="10" {...registerAddProduct("productName")} />
            {errorsAddProduct.productName && <span className="text-danger">{errorsAddProduct.productName.message}</span>}
            <label htmlFor="admin-new-product-description">Description</label>
            <textarea id="admin-new-product-description" rows="3" maxLength="20" {...registerAddProduct("productDescription")} />
            {errorsAddProduct.productDescription && <span className="text-danger">{errorsAddProduct.productDescription.message}</span>}
            <label htmlFor="admin-new-product-category">Category</label>
            <select id="admin-new-product-category" defaultValue="" {...registerAddProduct("category")}>
              <option value="" disabled>Select a category</option>
              {PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            {errorsAddProduct.category && <span className="text-danger">{errorsAddProduct.category.message}</span>}
            <label htmlFor="admin-new-product-price">Price</label>
            <input id="admin-new-product-price" type="number" min="0" step="any" {...registerAddProduct("price", { valueAsNumber: true })} />
            {errorsAddProduct.price && <span className="text-danger">{errorsAddProduct.price.message}</span>}
            <label htmlFor="admin-new-product-stock">Stock</label>
            <input id="admin-new-product-stock" type="number" min="0" step="1" {...registerAddProduct("stock", { valueAsNumber: true })} />
            {errorsAddProduct.stock && <span className="text-danger">{errorsAddProduct.stock.message}</span>}
            <label htmlFor="admin-new-product-image">Insert image</label>
            <input id="admin-new-product-image" type="file" accept="image/*" multiple {...registerAddProduct("productImages")} />
            {errorsAddProduct.productImages && <span className="text-danger">{errorsAddProduct.productImages.message}</span>}
            <button type="submit">Add</button>
          </form>
        </section>

        <section className={activeForm === "update-product" ? "form-panel active-panel" : "form-panel"} id="update-product">
          <h2>Update product</h2>
          <form className="simple-form" onSubmit={handleSubmitUpdateProduct(updateProduct)}>
            <label htmlFor="admin-update-product-id">Product ID</label>
            <input id="admin-update-product-id" type="text" maxLength="6" required {...registerUpdateProduct("productId")} />
            {errorsUpdateProduct.productId && <span className="text-danger">{errorsUpdateProduct.productId.message}</span>}
            <label htmlFor="admin-update-product-name">New name</label>
            <input id="admin-update-product-name" type="text" maxLength="10" placeholder="Leave blank to keep current name" {...registerUpdateProduct("productName")} />
            {errorsUpdateProduct.productName && <span className="text-danger">{errorsUpdateProduct.productName.message}</span>}
            <label htmlFor="admin-update-product-description">New description</label>
            <textarea id="admin-update-product-description" rows="3" maxLength="20" placeholder="Leave blank to keep current description" {...registerUpdateProduct("productDescription")} />
            {errorsUpdateProduct.productDescription && <span className="text-danger">{errorsUpdateProduct.productDescription.message}</span>}
            <label htmlFor="admin-update-product-category">Category</label>
            <select id="admin-update-product-category" defaultValue="" {...registerUpdateProduct("category")}>
              <option value="">Keep current category</option>
              {PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            {errorsUpdateProduct.category && <span className="text-danger">{errorsUpdateProduct.category.message}</span>}
            <label htmlFor="admin-update-product-price">New price</label>
            <input id="admin-update-product-price" type="number" min="0" step="any" {...registerUpdateProduct("price", { setValueAs: (value) => value === "" ? undefined : Number(value) })} />
            {errorsUpdateProduct.price && <span className="text-danger">{errorsUpdateProduct.price.message}</span>}
            <label htmlFor="admin-update-product-stock">New stock</label>
            <input id="admin-update-product-stock" type="number" min="0" step="1" {...registerUpdateProduct("stock", { setValueAs: (value) => value === "" ? undefined : Number(value) })} />
            {errorsUpdateProduct.stock && <span className="text-danger">{errorsUpdateProduct.stock.message}</span>}
            <label htmlFor="admin-update-product-image">Update image</label>
            <input id="admin-update-product-image" type="file" accept="image/*" multiple {...registerUpdateProduct("productImages")} />
            <button type="submit">Update</button>
          </form>
        </section>

        <section className={activeForm === "review-products" ? "form-panel active-panel" : "form-panel"} id="review-products">
          <h2>Review products</h2>
          <table className="orders-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.productId}>
                  <td>{product.productId}</td>
                  <td>{product.productName}</td>
                  <td>{product.category}</td>
                  <td>{product.price === undefined ? "—" : `$${product.price}`}</td>
                  <td>{product.stock ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {productsLoading && <p>Loading products...</p>}
          {!productsLoading && products.length === 0 && <p>No products found.</p>}
          {productMessage && <p role="status">{productMessage}</p>}
        </section>

        <section className={activeForm === "review-complaints" ? "form-panel active-panel" : "form-panel"} id="review-complaints">
          <h2>Review complaints</h2>
          <table className="orders-table">
            <thead>
              <tr><th>ID</th><th>Customer</th><th>Subject</th><th>Status</th></tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.complaintId}>
                  <td>{complaint.complaintId}</td>
                  <td>{complaint.source}</td>
                  <td>{complaint.subject}</td>
                  <td>{complaint.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {complaintsLoading && <p>Loading complaints...</p>}
          {!complaintsLoading && complaints.length === 0 && <p>No complaints found.</p>}
          {complaintMessage && <p role="status">{complaintMessage}</p>}
        </section>

        <section className={activeForm === "process-complaint" ? "form-panel active-panel" : "form-panel"} id="process-complaint">
          <h2>Process complaint</h2>
          <form className="simple-form" onSubmit={handleSubmitProcessComplaint(processComplaint)}>
            <label htmlFor="admin-complaint-id">Complaint ID</label>
            <input id="admin-complaint-id" type="number" min="1" step="1" {...registerProcessComplaint("complaintId", { valueAsNumber: true })} />
            {errorsProcessComplaint.complaintId && <span className="text-danger">{errorsProcessComplaint.complaintId.message}</span>}
            <label htmlFor="admin-complaint-status">Status</label>
            <select id="admin-complaint-status" defaultValue="Pending" {...registerProcessComplaint("status")}>
              <option>Pending</option>
              <option>Resolved</option>
            </select>
            <label htmlFor="admin-complaint-reply">Reply</label>
            <input id="admin-complaint-reply" type="text" maxLength="70" {...registerProcessComplaint("reply")} />
            <button type="submit">Process</button>
          </form>
        </section>

        <section className={activeForm === "delete-product" ? "form-panel active-panel" : "form-panel"} id="delete-product">
          <h2>Delete product</h2>
          <form className="simple-form" onSubmit={handleSubmitDeleteProduct(deleteProduct)}>
            <label htmlFor="admin-delete-product-id">Product ID</label>
            <input id="admin-delete-product-id" type="text" maxLength="6" required placeholder="Enter the unique product ID" {...registerDeleteProduct("productId")} />
            {errorsDeleteProduct.productId && <span className="text-danger">{errorsDeleteProduct.productId.message}</span>}
            <button type="submit">Delete</button>
          </form>
        </section>
      </main>
      
    </>
  );
}
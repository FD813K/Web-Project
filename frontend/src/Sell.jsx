import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addProductAxiosFunction, getApiErrorMessage } from "./Service/api.js";
import { PRODUCT_CATEGORIES } from "./constants/productCategories.js";

const productSchema = z.object({
  productId: z.string().min(1, "Product ID is required").max(6, "Product ID must be at most 6 characters"),
  productName: z.string().min(2, "Product Name must be at least 2 characters").max(10, "Product Name must be at most 10 characters"),
  productDescription: z.string().min(10, "Description must be at least 10 characters").max(20, "Description must be at most 20 characters"),
  category: z.enum(PRODUCT_CATEGORIES, { error: "Choose a product category" }),
  productImages: z.custom((files) => files?.length > 0, "At least one image is required"),
});

function Sell() {
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  async function myFormSubmissionFunction(data) {
    setSubmissionMessage(null);
    setIsSubmitting(true);

    try {
      const result = await addProductAxiosFunction(data);
      setSubmissionMessage({ type: "success", text: result.message || "Product listed successfully." });
      reset();
    } catch (error) {
      setSubmissionMessage({
        type: "error",
        text: getApiErrorMessage(error, "Unable to list the product. Please try again."),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="sell-page">
      <link rel="stylesheet" href="/sell.css" />
      <Link to="/" className="back-btn">← Back to Home</Link>
      <nav className="quicknav" aria-label="Marketplace pages">
        <Link to="/buy">Buy</Link><Link to="/sell">Sell</Link><Link to="/myproducts">My Products</Link><Link to="/complaints">Complaints</Link><Link to="/contact">Contact</Link>
      </nav>
      <h1>Sell a Product</h1>
      <form
        className="standard-form"
        id="sellForm"
        onSubmit={handleSubmit(myFormSubmissionFunction)}
      >
        <label htmlFor="productId">Product ID:</label>
        <input id="productId" type="text" maxLength="6" {...register("productId")} />
        {errors.productId && <span className="text-danger">{errors.productId.message}</span>}

        <label htmlFor="productName">Product Name:</label>
        <input id="productName" type="text" maxLength="10" {...register("productName")} />
        {errors.productName && <span className="text-danger">{errors.productName.message}</span>}

        <label htmlFor="productDescription">Description:</label>
        <textarea id="productDescription" rows="4" maxLength="20" {...register("productDescription")} />
        {errors.productDescription && <span className="text-danger">{errors.productDescription.message}</span>}

        <label htmlFor="category">Category:</label>
        <select id="category" defaultValue="" {...register("category")}>
          <option value="" disabled>Select a category</option>
          {PRODUCT_CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && <span className="text-danger">{errors.category.message}</span>}

        <label htmlFor="productImages">Choose Product Image(s):</label>
        <input
          id="productImages"
          type="file"
          accept="image/*"
          multiple
          {...register("productImages")}
        />
        {errors.productImages && <span className="text-danger">{errors.productImages.message}</span>}

        <button type="submit" disabled={isSubmitting}>
          List Product
        </button>
        {submissionMessage && (
          <p
            className={submissionMessage.type === "error" ? "text-danger" : "success-msg"}
            role={submissionMessage.type === "error" ? "alert" : "status"}
          >
            {submissionMessage.text}
          </p>
        )}
      </form>
      <p className="helper-link">Want to see, edit or delete what you've listed? <Link to="/myproducts">Go to My Products →</Link></p>
    </main>
  );
}

export default Sell;

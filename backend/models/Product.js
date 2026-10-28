import mongoose from "mongoose";

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Gaming",
  "Books",
  "Sports",
];

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 6,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 10,
  },
  productDescription: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 20,
  },
  category: {
    type: String,
    required: true,
    enum: PRODUCT_CATEGORIES,
  },
  price: {
    type: Number,
    min: 0,
  },
  stock: {
    type: Number,
    min: 0,
    validate: {
      validator: (amount) => amount === undefined || Number.isInteger(amount),
      message: "Stock must be a whole number",
    },
  },
  productImages: {
    type: [String],
    required: true,
    validate: {
      validator: (images) => images.length > 0,
      message: "At least one image is required",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;

import { randomInt } from "node:crypto";
import mongoose from "mongoose";
import { PRODUCT_CATEGORIES } from "./Product.js";

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
    required: true,
    unique: true,
    default: () => randomInt(100_000_000, 1_000_000_000),
  },
  productId: {
    type: String,
    trim: true,
    maxlength: 6,
  },
  product: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: PRODUCT_CATEGORIES,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    validate: Number.isInteger,
  },
  address: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Processing", "Shipped"],
    default: "Processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);

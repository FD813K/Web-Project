import { randomInt } from "node:crypto";
import mongoose from "mongoose";
import { PRODUCT_CATEGORIES } from "./Product.js";

const investmentSchema = new mongoose.Schema({
  investmentId: {
    type: Number,
    required: true,
    unique: true,
    default: () => randomInt(100_000_000, 1_000_000_000),
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 70,
  },
  category: {
    type: String,
    required: true,
    enum: PRODUCT_CATEGORIES,
  },
  shares: {
    type: Number,
    required: true,
    min: 1,
    validate: Number.isInteger,
  },
  pricePerShare: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Investment", investmentSchema);

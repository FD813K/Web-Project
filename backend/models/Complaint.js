import { randomInt } from "node:crypto";
import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: Number,
    required: true,
    unique: true,
    default: () => randomInt(100_000_000, 1_000_000_000),
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 70,
  },
  details: {
    type: String,
    required: true,
    trim: true,
    maxlength: 250,
  },
  source: {
    type: String,
    enum: ["Public", "Customer"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Resolved"],
    default: "Pending",
  },
  reply: {
    type: String,
    trim: true,
    maxlength: 70,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Complaint", complaintSchema);

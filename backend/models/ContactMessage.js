import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 70,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 70,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 70,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 250,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ContactMessage", contactMessageSchema);

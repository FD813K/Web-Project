import mongoose from "mongoose";

const customerAccountSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 70,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 70,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("CustomerAccount", customerAccountSchema);

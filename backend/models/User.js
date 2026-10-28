import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 70,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 70,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 25,
  },
  role: {
    type: String,
    enum: ["customer", "admin", "shareholder"],
    default: "customer",
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: {
    transform: (document, result) => {
      delete result.passwordHash;
      return result;
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;

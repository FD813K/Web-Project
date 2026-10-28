import mongoose from "mongoose";

const dividendSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: 2200,
    unique: true,
  },
  shares: {
    type: Number,
    required: true,
    min: 0,
    validate: Number.isInteger,
  },
  dividend: {
    type: Number,
    required: true,
    min: 0,
  },
});

export default mongoose.model("Dividend", dividendSchema);

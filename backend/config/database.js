import mongoose from "mongoose";

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured in backend/.env");
  }

  await mongoose.connect(uri, { dbName: "marketplace" });
}

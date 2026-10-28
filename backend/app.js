import cors from "cors";
import express from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import healthRoutes from "./routes/healthRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";

const app = express();
const uploadsDirectory = fileURLToPath(new URL("./uploads/", import.meta.url));
const configuredClientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = new Set([
  configuredClientUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin is not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.resolve(uploadsDirectory)));
app.use("/api/health", healthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api", workflowRoutes);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError || error.message === "Only image files are allowed") {
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Image file too large. Maximum size is 5MB."
      : error.message;
    return res.status(400).json({ success: false, message });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body is too large" });
  }

  if (error.message === "Origin is not allowed by CORS") {
    return res.status(403).json({ success: false, message: error.message });
  }

  console.error("Server request failed:", error.message);
  return res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;

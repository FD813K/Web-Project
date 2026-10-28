import Product, { PRODUCT_CATEGORIES } from "../models/Product.js";
import { unlink } from "node:fs/promises";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function productIdQuery(productId) {
  return { productId: new RegExp(`^${escapeRegExp(productId)}$`, "i") };
}

async function removeUploadedFiles(files = []) {
  await Promise.all(
    files.map(async (file) => {
      try {
        await unlink(file.path);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error("Could not remove an unused upload:", error.message);
        }
      }
    })
  );
}

function validateProduct(product, requireImages = true) {
  if (!product.productId || product.productId.length > 6) {
    return "Product ID is required and must be at most 6 characters";
  }
  if (product.productName.length < 2 || product.productName.length > 10) {
    return "Product name must be between 2 and 10 characters";
  }
  if (product.productDescription.length < 10 || product.productDescription.length > 20) {
    return "Product description must be between 10 and 20 characters";
  }
  if (!PRODUCT_CATEGORIES.includes(product.category)) {
    return "Choose a valid product category";
  }
  if (product.price !== undefined && (!Number.isFinite(product.price) || product.price < 0)) {
    return "Price must be a non-negative number";
  }
  if (product.stock !== undefined && (!Number.isInteger(product.stock) || product.stock < 0)) {
    return "Stock must be a non-negative whole number";
  }
  if (requireImages && product.productImages.length === 0) {
    return "At least one image is required";
  }
  return null;
}

function sendDatabaseError(res, error) {
  console.error("Product request failed:", error.message);

  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "Product ID already exists" });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ success: false, message: error.message });
  }
  return res.status(500).json({ success: false, message: "Unable to complete product request" });
}

export async function addProduct(req, res) {
  const uploadedFiles = req.files || [];
  const product = {
    productId: String(req.body.productId || "").trim(),
    productName: String(req.body.productName || "").trim(),
    productDescription: String(req.body.productDescription || "").trim(),
    category: String(req.body.category || "").trim(),
    price: req.body.price === undefined || req.body.price === "" ? undefined : Number(req.body.price),
    stock: req.body.stock === undefined || req.body.stock === "" ? undefined : Number(req.body.stock),
    productImages: uploadedFiles.map((file) => `/uploads/${file.filename}`),
  };
  const validationError = validateProduct(product);

  if (validationError) {
    await removeUploadedFiles(uploadedFiles);
    return res.status(400).json({ success: false, message: validationError });
  }

  try {
    const existingProduct = await Product.findOne(productIdQuery(product.productId));
    if (existingProduct) {
      await removeUploadedFiles(uploadedFiles);
      return res.status(409).json({ success: false, message: "Product ID already exists" });
    }

    const savedProduct = await Product.create(product);
    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    await removeUploadedFiles(uploadedFiles);
    return sendDatabaseError(res, error);
  }
}

export async function getProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    return sendDatabaseError(res, error);
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findOne(productIdQuery(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return sendDatabaseError(res, error);
  }
}

export async function updateProduct(req, res) {
  const uploadedFiles = req.files || [];

  try {
    const product = await Product.findOne(productIdQuery(req.params.id));
    if (!product) {
      await removeUploadedFiles(uploadedFiles);
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const updatedFields = {
      productId: String(req.body.productId ?? product.productId).trim(),
      productName: String(req.body.productName || product.productName).trim(),
      productDescription: String(req.body.productDescription || product.productDescription).trim(),
      category: String(req.body.category || product.category || "").trim(),
      price: req.body.price === undefined || req.body.price === "" ? product.price : Number(req.body.price),
      stock: req.body.stock === undefined || req.body.stock === "" ? product.stock : Number(req.body.stock),
      productImages: uploadedFiles.length
        ? uploadedFiles.map((file) => `/uploads/${file.filename}`)
        : product.productImages,
    };
    const validationError = validateProduct(updatedFields);
    if (validationError) {
      await removeUploadedFiles(uploadedFiles);
      return res.status(400).json({ success: false, message: validationError });
    }

    const duplicateProduct = await Product.findOne({
      ...productIdQuery(updatedFields.productId),
      _id: { $ne: product._id },
    });
    if (duplicateProduct) {
      await removeUploadedFiles(uploadedFiles);
      return res.status(409).json({ success: false, message: "Product ID already exists" });
    }

    Object.assign(product, updatedFields);
    const savedProduct = await product.save();
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: savedProduct,
    });
  } catch (error) {
    await removeUploadedFiles(uploadedFiles);
    return sendDatabaseError(res, error);
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await Product.findOneAndDelete(productIdQuery(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return sendDatabaseError(res, error);
  }
}

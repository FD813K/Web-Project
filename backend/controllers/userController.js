import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import User from "../models/User.js";

const scrypt = promisify(scryptCallback);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function passwordMatches(password, storedHash) {
  if (typeof storedHash !== "string") {
    return false;
  }
  const [salt, savedKeyHex] = storedHash.split(":");
  if (!salt || !/^[a-f0-9]{128}$/i.test(savedKeyHex || "")) {
    return false;
  }
  const savedKey = Buffer.from(savedKeyHex, "hex");
  const candidateKey = await scrypt(password, salt, savedKey.length);
  return timingSafeEqual(savedKey, candidateKey);
}

export async function registerUser(req, res) {
  const fullName = String(req.body.fullName || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const username = String(req.body.username || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const confirmPassword = String(req.body.confirmPassword || "");

  if (!fullName || fullName.length > 70) {
    return res.status(400).json({ success: false, message: "Full name is required and must be at most 70 characters" });
  }
  if (email.length > 70 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Enter a valid email address" });
  }
  if (!username || username.length > 25) {
    return res.status(400).json({ success: false, message: "Username is required and must be at most 25 characters" });
  }
  if (password.length < 8 || password.length > 25) {
    return res.status(400).json({ success: false, message: "Password must be between 8 and 25 characters" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match" });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      const message = existingUser.email === email
        ? "An account with this email already exists"
        : "This username is already taken";
      return res.status(409).json({ success: false, message });
    }

    const user = await User.create({
      fullName,
      email,
      username,
      passwordHash: await hashPassword(password),
    });

    return res.status(201).json({
      success: true,
      message: "Account registered successfully. You can now sign in.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      const message = duplicateField === "email"
        ? "An account with this email already exists"
        : "This username is already taken";
      return res.status(409).json({ success: false, message });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }

    console.error("User registration failed:", error.name);
    return res.status(500).json({ success: false, message: "Unable to register account" });
  }
}

export async function loginUser(req, res) {
  const identifier = String(req.body.username || req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const role = String(req.body.role || "customer");
  const allowedRoles = ["customer", "admin", "shareholder"];

  if (!identifier || identifier.length > 70 || !password || password.length > 25) {
    return res.status(400).json({ success: false, message: "Enter a valid username/email and password" });
  }
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid account type" });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+passwordHash");

    if (!user || (user.role || "customer") !== role || !(await passwordMatches(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: "Invalid username/email or password" });
    }

    return res.status(200).json({
      success: true,
      message: "Credentials verified",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role || "customer",
      },
    });
  } catch (error) {
    console.error("Login request failed:", error.name);
    return res.status(500).json({ success: false, message: "Unable to verify credentials" });
  }
}

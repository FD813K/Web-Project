import CustomerAccount from "../models/CustomerAccount.js";
import Complaint from "../models/Complaint.js";
import ContactMessage from "../models/ContactMessage.js";
import Dividend from "../models/Dividend.js";
import Investment from "../models/Investment.js";
import Order from "../models/Order.js";
import { PRODUCT_CATEGORIES } from "../models/Product.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function respondWithError(res, error, operation) {
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: "That record already exists" });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ success: false, message: "The submitted data is invalid" });
  }

  console.error(`${operation} failed:`, error.name);
  return res.status(500).json({ success: false, message: `Unable to ${operation}` });
}

export async function createOrder(req, res) {
  const product = String(req.body?.product || "").trim();
  const quantity = Number(req.body?.quantity);

  if (!product || !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ success: false, message: "Enter a product and a valid quantity" });
  }

  try {
    const order = await Order.create({
      product,
      quantity,
    });
    return res.status(201).json({
      success: true,
      message: "Order saved successfully",
      order: { orderNumber: order.orderNumber, status: order.status },
    });
  } catch (error) {
    return respondWithError(res, error, "save order");
  }
}

export async function getOrders(req, res) {
  try {
    const orders = await Order.find()
      .select("orderNumber productId product category quantity status createdAt")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return respondWithError(res, error, "load orders");
  }
}

export async function deleteOrder(req, res) {
  const orderNumber = Number(req.params.orderNumber);
  if (!Number.isInteger(orderNumber) || orderNumber < 1) {
    return res.status(400).json({ success: false, message: "Enter a valid order number" });
  }

  try {
    const order = await Order.findOneAndDelete({ orderNumber });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    return respondWithError(res, error, "cancel order");
  }
}

export async function saveCustomerAccount(req, res) {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();

  if (name.length > 70 || !emailPattern.test(email) || email.length > 70) {
    return res.status(400).json({ success: false, message: "Enter a valid name and email" });
  }

  try {
    await CustomerAccount.findOneAndUpdate(
      { email },
      { name, email, updatedAt: new Date() },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({
      success: true,
      message: "Account details saved. Enter a shipping address when placing an order.",
    });
  } catch (error) {
    return respondWithError(res, error, "save account details");
  }
}

async function saveComplaint(req, res, source, details) {
  const subject = String(req.body?.subject || "").trim();
  const complaintDetails = String(details || "").trim();
  if (!subject || subject.length > 70 || !complaintDetails || complaintDetails.length > 250) {
    return res.status(400).json({ success: false, message: "Subject and details are required" });
  }

  try {
    const complaint = await Complaint.create({ subject, details: complaintDetails, source });
    return res.status(201).json({
      success: true,
      message: "Complaint saved successfully",
      complaint: { complaintId: complaint.complaintId, status: complaint.status },
    });
  } catch (error) {
    return respondWithError(res, error, "save complaint");
  }
}

export function createPublicComplaint(req, res) {
  return saveComplaint(req, res, "Public", req.body?.message);
}

export function createCustomerComplaint(req, res) {
  return saveComplaint(req, res, "Customer", req.body?.details);
}

export async function getComplaints(req, res) {
  try {
    const complaints = await Complaint.find()
      .select("complaintId source subject status reply createdAt")
      .sort({ createdAt: -1 });
    return res.status(200).json(complaints);
  } catch (error) {
    return respondWithError(res, error, "load complaints");
  }
}

export async function getComplaintStatus(req, res) {
  const complaintId = Number(req.params.complaintId);
  if (!Number.isInteger(complaintId) || complaintId < 1) {
    return res.status(400).json({ success: false, message: "Enter a valid complaint ID" });
  }

  try {
    const complaint = await Complaint.findOne({ complaintId })
      .select("complaintId status reply");
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }
    return res.status(200).json(complaint);
  } catch (error) {
    return respondWithError(res, error, "load complaint status");
  }
}

export async function updateComplaint(req, res) {
  const complaintId = Number(req.params.complaintId);
  const status = String(req.body?.status || "");
  const reply = String(req.body?.reply || "").trim();
  if (!Number.isInteger(complaintId) || complaintId < 1
    || !["Pending", "Resolved"].includes(status) || reply.length > 70) {
    return res.status(400).json({ success: false, message: "Enter a valid complaint ID, status, and reply" });
  }

  try {
    const complaint = await Complaint.findOneAndUpdate(
      { complaintId },
      { status, reply },
      { new: true, runValidators: true }
    );
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }
    return res.status(200).json({ success: true, message: "Complaint updated successfully" });
  } catch (error) {
    return respondWithError(res, error, "update complaint");
  }
}

export async function createContactMessage(req, res) {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const subject = String(req.body?.subject || "").trim();
  const message = String(req.body?.message || "").trim();
  if (!name || name.length > 70 || !emailPattern.test(email) || email.length > 70
    || !subject || subject.length > 70 || !message || message.length > 250) {
    return res.status(400).json({ success: false, message: "Check the name, email, subject, and message" });
  }

  try {
    await ContactMessage.create({ name, email, subject, message });
    return res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    return respondWithError(res, error, "save contact message");
  }
}

export async function createInvestment(req, res) {
  const name = String(req.body?.name || "").trim();
  const category = String(req.body?.category || "").trim();
  const shares = Number(req.body?.shares);
  const pricePerShare = Number(req.body?.pricePerShare);
  if (!name || name.length > 70 || !PRODUCT_CATEGORIES.includes(category)
    || !Number.isInteger(shares) || shares < 1
    || !Number.isFinite(pricePerShare) || pricePerShare < 0) {
    return res.status(400).json({ success: false, message: "Check the name, category, shares, and price per share" });
  }

  try {
    const investment = await Investment.create({ name, category, shares, pricePerShare });
    return res.status(201).json({
      success: true,
      message: "Investment saved successfully",
      investmentId: investment.investmentId,
    });
  } catch (error) {
    return respondWithError(res, error, "save investment");
  }
}

export async function getInvestments(req, res) {
  try {
    const investments = await Investment.find().sort({ createdAt: -1 });
    return res.status(200).json(investments);
  } catch (error) {
    return respondWithError(res, error, "load investments");
  }
}

export async function updateInvestment(req, res) {
  const investmentId = Number(req.params.investmentId);
  const shares = Number(req.body?.shares);
  const category = req.body?.category === undefined || req.body.category === ""
    ? undefined
    : String(req.body.category);
  if (!Number.isInteger(investmentId) || investmentId < 1 || !Number.isInteger(shares) || shares < 1
    || (category !== undefined && !PRODUCT_CATEGORIES.includes(category))) {
    return res.status(400).json({ success: false, message: "Enter a valid investment ID, category, and share amount" });
  }

  const updatedFields = { shares };
  if (category !== undefined) updatedFields.category = category;

  try {
    const investment = await Investment.findOneAndUpdate(
      { investmentId },
      updatedFields,
      { new: true, runValidators: true }
    );
    if (!investment) {
      return res.status(404).json({ success: false, message: "Investment not found" });
    }
    return res.status(200).json({ success: true, message: "Investment updated successfully" });
  } catch (error) {
    return respondWithError(res, error, "update investment");
  }
}

export async function deleteInvestment(req, res) {
  const investmentId = Number(req.params.investmentId);
  if (!Number.isInteger(investmentId) || investmentId < 1) {
    return res.status(400).json({ success: false, message: "Enter a valid investment ID" });
  }

  try {
    const investment = await Investment.findOneAndDelete({ investmentId });
    if (!investment) {
      return res.status(404).json({ success: false, message: "Investment not found" });
    }
    return res.status(200).json({ success: true, message: "Investment deleted successfully" });
  } catch (error) {
    return respondWithError(res, error, "delete investment");
  }
}

export async function getDividends(req, res) {
  try {
    const dividends = await Dividend.find().sort({ year: -1 });
    return res.status(200).json(dividends);
  } catch (error) {
    return respondWithError(res, error, "load dividends");
  }
}

import { Router } from "express";
import {
  createContactMessage,
  createCustomerComplaint,
  createInvestment,
  createOrder,
  createPublicComplaint,
  deleteInvestment,
  deleteOrder,
  getComplaints,
  getComplaintStatus,
  getDividends,
  getInvestments,
  getOrders,
  saveCustomerAccount,
  updateComplaint,
  updateInvestment,
} from "../controllers/workflowController.js";

const router = Router();

router.post("/orders", createOrder);
router.get("/orders", getOrders);
router.delete("/orders/:orderNumber", deleteOrder);
router.put("/customer/account", saveCustomerAccount);
router.post("/complaints", createPublicComplaint);
router.post("/customer/complaints", createCustomerComplaint);
router.get("/complaints", getComplaints);
router.get("/customer/complaints/:complaintId", getComplaintStatus);
router.patch("/complaints/:complaintId", updateComplaint);
router.post("/contact", createContactMessage);
router.post("/shareholder/investments", createInvestment);
router.get("/shareholder/investments", getInvestments);
router.patch("/shareholder/investments/:investmentId", updateInvestment);
router.delete("/shareholder/investments/:investmentId", deleteInvestment);
router.get("/shareholder/dividends", getDividends);

export default router;

import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { 
  getPaymentSummary, 
  getTransactions, 
  getInvoices, 
  getEscrows, 
  createEscrow, 
  releaseEscrow,
  getEngagementDetails
} from "../controllers/paymentController.js";

const router = express.Router();

// Securing all payment routes via authentication middleware
router.use(requireAuth);

router.get("/summary", getPaymentSummary);
router.get("/transactions", getTransactions);
router.get("/invoices", getInvoices);
router.get("/escrows", getEscrows);
router.get("/engagement/:engagementId", getEngagementDetails);

router.post("/escrow/create", createEscrow);
router.post("/escrow/release", releaseEscrow);

export default router;

import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getCompanyProfile, getRegisteredExperts, getRegisteredExpertById } from "../controllers/companyController.js";

const router = express.Router();

router.get("/profile", requireAuth, getCompanyProfile);
router.get("/experts", requireAuth, getRegisteredExperts);
router.get("/experts/:expertId", requireAuth, getRegisteredExpertById);

export default router;

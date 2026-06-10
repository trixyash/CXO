import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getExpertProfile, updateExpertProfile, getOpportunities } from "../controllers/expertController.js";

const router = express.Router();

router.get("/profile", requireAuth, getExpertProfile);
router.put("/profile", requireAuth, updateExpertProfile);
router.get("/opportunities", requireAuth, getOpportunities);

export default router;

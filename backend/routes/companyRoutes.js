import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getCompanyProfile } from "../controllers/companyController.js";

const router = express.Router();

router.get("/profile", requireAuth, getCompanyProfile);

export default router;

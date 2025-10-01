import { Router } from "express";
import { getDashboardStats, getRevenueAnalytics } from "../controller/dashboardController";
import { protect } from "../middleware/authenticationMiddleware";

const router = Router();

// All dashboard routes require authentication
router.get("/stats", protect, getDashboardStats);
router.get("/revenue", protect, getRevenueAnalytics);

export default router;


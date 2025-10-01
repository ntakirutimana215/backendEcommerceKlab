"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controller/dashboardController");
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const router = (0, express_1.Router)();
// All dashboard routes require authentication
router.get("/stats", authenticationMiddleware_1.protect, dashboardController_1.getDashboardStats);
router.get("/revenue", authenticationMiddleware_1.protect, dashboardController_1.getRevenueAnalytics);
exports.default = router;

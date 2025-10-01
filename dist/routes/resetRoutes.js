"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ResetController_1 = require("../controller/ResetController");
const router = (0, express_1.Router)();
router.post("/request-reset", ResetController_1.requestPasswordReset); // Step 1: Send OTP
router.post("/reset-password", ResetController_1.resetPassword); // Step 2: Verify OTP + reset password
exports.default = router;

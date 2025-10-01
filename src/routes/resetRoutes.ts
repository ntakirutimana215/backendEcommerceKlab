import { Router } from "express";
import { requestPasswordReset, resetPassword } from "../controller/ResetController";

const router = Router();

router.post("/request-reset", requestPasswordReset);  // Step 1: Send OTP
router.post("/reset-password", resetPassword);        // Step 2: Verify OTP + reset password

export default router;

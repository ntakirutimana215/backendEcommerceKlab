import { Router } from "express";
import {createContact}  from "../controller/contactController";
const router = Router();
router.post("/send-email", createContact);
export default router;
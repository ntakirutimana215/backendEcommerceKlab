"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controller/contactController");
const router = (0, express_1.Router)();
router.post("/send-email", contactController_1.createContact);
exports.default = router;

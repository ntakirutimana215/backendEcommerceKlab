"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controller/categoryController");
const router = (0, express_1.Router)();
router.post("/createCategory", categoryController_1.createCategory); // Create
router.get("/", categoryController_1.getCategories); // Read all
router.get("/:id", categoryController_1.getCategoryById); // Read one
router.put("/:id", categoryController_1.updateCategory); // Update
router.delete("/:id", categoryController_1.deleteCategory); // Delete
exports.default = router;

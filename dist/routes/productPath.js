"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const productcontroller_1 = require("../controller/productcontroller");
const router = (0, express_1.Router)();
// Multer config (you can also customize storage if needed)
const storage = multer_1.default.memoryStorage(); // keep file in memory, good when uploading to Cloudinary
const upload = (0, multer_1.default)({ storage });
// Get all products
router.get("/", productcontroller_1.getProducts);
// Get single product by ID
router.get("/:id", productcontroller_1.getProductById);
// Create product with images (accept multiple images)
router.post("/", upload.array("images", 5), productcontroller_1.createProduct);
// Update product
router.put("/:id", productcontroller_1.updateProduct);
// Delete product
router.delete("/:id", productcontroller_1.deleteProduct);
// Update stock
router.patch("/:id/stock", productcontroller_1.updateStock);
exports.default = router;

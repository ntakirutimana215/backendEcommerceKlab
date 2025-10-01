import { Router } from "express";
import multer from "multer";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
} from "../controller/productcontroller";

const router = Router();

// Multer config (you can also customize storage if needed)
const storage = multer.memoryStorage(); // keep file in memory, good when uploading to Cloudinary
const upload = multer({ storage });

// Get all products
router.get("/", getProducts);

// Get single product by ID
router.get("/:id", getProductById);

// Create product with images (accept multiple images)
router.post("/", upload.array("images", 5), createProduct);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

// Update stock
router.patch("/:id/stock", updateStock);

export default router;


import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController";

const router = Router();

router.post("/createCategory", createCategory);      // Create
router.get("/", getCategories);        // Read all
router.get("/:id", getCategoryById);   // Read one
router.put("/:id", updateCategory);    // Update
router.delete("/:id", deleteCategory); // Delete

export default router;

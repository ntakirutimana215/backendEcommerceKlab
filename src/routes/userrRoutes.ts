import { Router } from "express";
import { registerUser, loginUser, getAllUsers, getUserById, getCurrentUser } from "../controller/userController";
import { protect } from "../middleware/authenticationMiddleware";

const router = Router();

router.get("/", getAllUsers); // GET all users
// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get current user (protected route)
router.get("/me", protect, getCurrentUser);

router.get("/:id", getUserById); // GET single user by ID

export default router;

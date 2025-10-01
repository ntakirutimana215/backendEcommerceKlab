import { Router } from "express";
import { createOrderFromCart, getMyOrders, getAllOrders, updateOrderStatus } from "../controller/orderController";
import { protect } from "../middleware/authenticationMiddleware";

const router = Router();

router.post("/create-from-cart", protect, createOrderFromCart);
router.get("/my-orders", protect, getMyOrders);
router.get("/all", protect, getAllOrders);
router.put("/update-status/:orderId", protect, updateOrderStatus);

export default router;

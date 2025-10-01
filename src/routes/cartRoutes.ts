import { Router } from "express";
import { getCart, addToCart, removeFromCart, updateCartItem } from "../controller/cartController";
import { protect } from "../middleware/authenticationMiddleware";
import { AuthRequest } from "../types/express";
import { Response, NextFunction } from "express";

const router = Router();

const wrap = (fn: (req: AuthRequest, res: Response, next?: NextFunction) => Promise<any>) => {
  return (req: any, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

router.get("/", protect, wrap(getCart));
router.post("/add", protect, wrap(addToCart));
router.put("/:productId", protect, wrap(updateCartItem));
router.delete("/:productId", protect, wrap(removeFromCart));

export default router;

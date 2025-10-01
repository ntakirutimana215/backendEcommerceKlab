"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controller/cartController");
const authenticationMiddleware_1 = require("../middleware/authenticationMiddleware");
const router = (0, express_1.Router)();
const wrap = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
router.get("/", authenticationMiddleware_1.protect, wrap(cartController_1.getCart));
router.post("/add", authenticationMiddleware_1.protect, wrap(cartController_1.addToCart));
router.put("/:productId", authenticationMiddleware_1.protect, wrap(cartController_1.updateCartItem));
router.delete("/:productId", authenticationMiddleware_1.protect, wrap(cartController_1.removeFromCart));
exports.default = router;

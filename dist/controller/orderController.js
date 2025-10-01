"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = exports.getMyOrders = exports.createOrderFromCart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const productmodels_1 = __importDefault(require("../models/productmodels"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
/**
 * Create an order from the current user's cart.
 * Skips products that are missing or have insufficient stock.
 */
const createOrderFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const authReq = req;
    try {
        // Find user's cart and populate products
        const cart = yield cartModel_1.default.findOne({ user: (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id })
            .populate("products.product");
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        let totalAmount = 0;
        const orderItems = [];
        const skippedProducts = [];
        for (const item of cart.products) {
            let productDoc = null;
            // Type guard: is it already populated?
            if (item.product && typeof item.product === "object" && item.product && "_id" in item.product) {
                productDoc = item.product;
            }
            // Otherwise, it's an ObjectId — fetch from DB
            else if (mongoose_1.default.Types.ObjectId.isValid(item.product)) {
                const productId = item.product; // safe conversion
                productDoc = yield productmodels_1.default.findById(productId);
            }
            if (!productDoc) {
                const prodId = typeof item.product === "object" && item.product && "_id" in item.product
                    ? item.product._id.toString()
                    : item.product;
                skippedProducts.push(prodId);
                continue;
            }
            // Check stock
            if (productDoc.stock < item.quantity) {
                skippedProducts.push(productDoc.name || productDoc._id.toString());
                continue;
            }
            // Calculate total and reduce stock
            totalAmount += productDoc.price * item.quantity;
            productDoc.stock -= item.quantity;
            yield productDoc.save();
            // Add to order items
            orderItems.push({ product: productDoc._id.toString(), quantity: item.quantity });
        }
        if (orderItems.length === 0) {
            return res.status(400).json({ message: "No products available for order", skippedProducts });
        }
        // Create the order
        const order = yield orderModel_1.default.create({
            user: (_b = authReq.user) === null || _b === void 0 ? void 0 : _b._id,
            items: orderItems,
            totalAmount,
            status: "pending",
        });
        // Remove ordered products from cart
        cart.products = cart.products.filter(p => {
            const prodId = typeof p.product === "object" && p.product && "_id" in p.product
                ? p.product._id.toString()
                : p.product;
            return !orderItems.find(o => o.product === prodId);
        });
        yield cart.save();
        return res.status(201).json({
            message: "Order created successfully",
            order,
            skippedProducts: skippedProducts.length > 0 ? skippedProducts : undefined,
        });
    }
    catch (err) {
        console.error("Order from cart error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.createOrderFromCart = createOrderFromCart;
/**
 * Get all orders of the logged-in user
 */
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authReq = req;
    try {
        const orders = yield orderModel_1.default.find({ user: (_a = authReq.user) === null || _a === void 0 ? void 0 : _a._id }).populate("items.product");
        return res.json(orders);
    }
    catch (err) {
        console.error("Get my orders error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.getMyOrders = getMyOrders;
/**
 * Get all orders (admin use case)
 */
const getAllOrders = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderModel_1.default.find().populate("items.product").populate("user", "fullname email");
        return res.json(orders);
    }
    catch (err) {
        console.error("Get all orders error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.getAllOrders = getAllOrders;
/**
 * Update order status
 */
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }
        const order = yield orderModel_1.default.findByIdAndUpdate(orderId, { status }, { new: true }).populate("items.product").populate("user");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.json(order);
    }
    catch (err) {
        console.error("Update order status error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.updateOrderStatus = updateOrderStatus;

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
exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const productmodels_1 = __importDefault(require("../models/productmodels"));
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield cartModel_1.default.findOne({ user: req.user._id })
            .populate("products.product")
            .exec();
        // Filter out any items where product is null (deleted products)
        if (cart && cart.products) {
            cart.products = cart.products.filter(item => item.product != null);
            yield cart.save();
        }
        res.json(cart || { user: req.user._id, products: [] });
    }
    catch (err) {
        console.error("Get cart error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getCart = getCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity = 1 } = req.body;
        // Validate inputs
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        // Check if product exists and is available
        const existingProduct = yield productmodels_1.default.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (!existingProduct.isActive) {
            return res.status(400).json({ message: "Product is not available" });
        }
        if (existingProduct.stock < quantity) {
            return res.status(400).json({
                message: `Only ${existingProduct.stock} items available in stock`
            });
        }
        let cart = yield cartModel_1.default.findOne({ user: req.user._id });
        if (!cart) {
            cart = new cartModel_1.default({
                user: req.user._id,
                products: []
            });
        }
        // Clean up any null product references first
        cart.products = cart.products.filter(item => item.product != null);
        const itemIndex = cart.products.findIndex((p) => p.product && p.product.toString() === productId);
        if (itemIndex > -1) {
            // Update existing item
            cart.products[itemIndex].quantity += quantity;
            // Check stock for updated quantity
            if (existingProduct.stock < cart.products[itemIndex].quantity) {
                return res.status(400).json({
                    message: `Cannot add more than available stock (${existingProduct.stock})`
                });
            }
        }
        else {
            // Add new item
            cart.products.push({
                product: new mongoose_1.default.Types.ObjectId(productId),
                quantity
            });
        }
        yield cart.save();
        const updatedCart = yield cartModel_1.default.findById(cart._id).populate("products.product");
        res.json(updatedCart);
    }
    catch (err) {
        console.error("Add to cart error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.addToCart = addToCart;
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        if (quantity <= 0) {
            return (0, exports.removeFromCart)(req, res);
        }
        const cart = yield cartModel_1.default.findOne({ user: req.user._id });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        // Clean up any null product references first
        cart.products = cart.products.filter(item => item.product != null);
        const itemIndex = cart.products.findIndex((p) => p.product && p.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        // Check product stock
        const product = yield productmodels_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.stock < quantity) {
            return res.status(400).json({
                message: `Only ${product.stock} items available in stock`
            });
        }
        cart.products[itemIndex].quantity = quantity;
        yield cart.save();
        const updatedCart = yield cartModel_1.default.findById(cart._id).populate("products.product");
        res.json(updatedCart);
    }
    catch (err) {
        console.error("Update cart item error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateCartItem = updateCartItem;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const cart = yield cartModel_1.default.findOne({ user: req.user._id });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        // Remove the item and clean up any null references
        cart.products = cart.products.filter((p) => p.product && p.product.toString() !== productId);
        yield cart.save();
        const updatedCart = yield cartModel_1.default.findById(cart._id).populate("products.product");
        res.json(updatedCart);
    }
    catch (err) {
        console.error("Remove from cart error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.removeFromCart = removeFromCart;

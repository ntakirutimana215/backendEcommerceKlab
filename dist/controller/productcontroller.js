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
exports.updateStock = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.createProduct = exports.getProducts = void 0;
const productmodels_1 = __importDefault(require("../models/productmodels"));
const streamifier_1 = __importDefault(require("streamifier"));
const cloudnaryConfig_1 = __importDefault(require("../utils/cloudnaryConfig")); // your existing config
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productmodels_1.default.find().populate("category", "name");
        res.json(products);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, stock, category } = req.body;
        if (!name || !price || !category) {
            return res.status(400).json({ message: "Name, price and category are required" });
        }
        const sizes = req.body.sizes
            ? Array.isArray(req.body.sizes)
                ? req.body.sizes
                : [req.body.sizes]
            : [];
        const colors = req.body.colors
            ? Array.isArray(req.body.colors)
                ? req.body.colors
                : [req.body.colors]
            : [];
        // Upload images to Cloudinary
        let imageUrls = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                const result = yield new Promise((resolve, reject) => {
                    const uploadStream = cloudnaryConfig_1.default.uploader.upload_stream({ folder: "products" }, (error, result) => {
                        if (error)
                            return reject(error);
                        resolve(result);
                    });
                    streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
                });
                imageUrls.push(result.secure_url);
            }
        }
        const product = yield productmodels_1.default.create({
            name,
            description: description || "",
            price: Number(price),
            stock: Number(stock),
            sizes,
            colors,
            category,
            images: imageUrls,
        });
        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    }
    catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({
            message: err.message || "Server error",
        });
    }
});
exports.createProduct = createProduct;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productmodels_1.default.findById(req.params.id).populate("category", "name");
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Server error" });
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const product = yield productmodels_1.default.findByIdAndUpdate(id, updateData, { new: true }).populate("category", "name");
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json({ success: true, product });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Server error" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield productmodels_1.default.findByIdAndDelete(id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json({ success: true, message: "Product deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Server error" });
    }
});
exports.deleteProduct = deleteProduct;
const updateStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const stock = Number(req.body.stock);
        const product = yield productmodels_1.default.findById(id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        product.stock = stock;
        yield product.save();
        res.json({ success: true, product });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Server error" });
    }
});
exports.updateStock = updateStock;
